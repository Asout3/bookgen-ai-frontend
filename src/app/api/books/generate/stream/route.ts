import { NextRequest } from 'next/server';
import { generateBook, bookToMarkdown, type BookGenerationOptions } from '@/lib/bookgen-engine';
import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const userId = session.user.id;
    const body = await request.json();
    
    const {
      title,
      genre,
      audience,
      description,
      tone,
      style,
      bookLength = 'mid'
    } = body;

    // Validate required fields
    if (!title || !genre || !audience || !description || !tone || !style) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Missing required fields' })}\n\n`));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate the book with progress updates
          const generatedBook = await generateBook({
            title,
            topic: description,
            genre,
            audience,
            description,
            tone,
            style,
            bookLength,
            onProgress: (progress: number, message: string) => {
              const data = JSON.stringify({ progress, message });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          } as BookGenerationOptions);

          // Convert to markdown
          const markdownContent = bookToMarkdown(generatedBook);
          const wordCount = markdownContent.split(/\s+/).length;
          const chapterCount = generatedBook.metadata.totalChapters;

          // Save to database
          const now = new Date().toISOString();
          const [savedBook] = await db.insert(books).values({
            userId,
            title,
            genre,
            audience,
            description,
            tone,
            style,
            chapters: chapterCount,
            wordsPerChapter: Math.round(wordCount / chapterCount),
            totalWords: wordCount,
            status: 'completed',
            content: markdownContent,
            coverUrl: null,
            createdAt: now,
            updatedAt: now,
          }).returning();

          // Send completion message
          const completionData = JSON.stringify({
            progress: 100,
            message: 'Complete!',
            book: {
              id: savedBook.id,
              title: savedBook.title,
              genre: savedBook.genre,
              audience: savedBook.audience,
              description: savedBook.description,
              chapters: savedBook.chapters,
              totalWords: savedBook.totalWords,
              status: savedBook.status,
              createdAt: savedBook.createdAt,
            }
          });
          controller.enqueue(encoder.encode(`data: ${completionData}\n\n`));
          controller.close();

        } catch (error) {
          console.error('Stream generation error:', error);
          const errorData = JSON.stringify({
            error: error instanceof Error ? error.message : 'Generation failed'
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Book generation stream error:', error);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to start generation' })}\n\n`));
        controller.close();
      }
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
