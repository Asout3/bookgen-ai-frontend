import { NextRequest, NextResponse } from 'next/server';
import { generateBook, bookToMarkdown, type BookGenerationOptions } from '@/lib/bookgen-engine';
import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const maxDuration = 300; // 5 minutes timeout for book generation

export async function POST(request: NextRequest) {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
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
      bookLength = 'mid' // short (5 chapters), mid (10 chapters), long (15 chapters)
    } = body;

    // Validate required fields
    if (!title || !genre || !audience || !description || !tone || !style) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate book length
    if (!['short', 'mid', 'long'].includes(bookLength)) {
      return NextResponse.json(
        { error: 'Invalid book length. Must be: short, mid, or long' },
        { status: 400 }
      );
    }

    // Generate the book with AI
    const generatedBook = await generateBook({
      title,
      topic: description,
      genre,
      audience,
      description,
      tone,
      style,
      bookLength,
    } as BookGenerationOptions);

    // Convert to markdown
    const markdownContent = bookToMarkdown(generatedBook);

    // Calculate actual word count
    const wordCount = markdownContent.split(/\s+/).length;
    
    // Determine chapter count based on book length
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

    return NextResponse.json({
      id: savedBook.id,
      title: savedBook.title,
      genre: savedBook.genre,
      audience: savedBook.audience,
      description: savedBook.description,
      chapters: savedBook.chapters,
      totalWords: savedBook.totalWords,
      status: savedBook.status,
      createdAt: savedBook.createdAt,
      content: markdownContent,
    });

  } catch (error) {
    console.error('Book generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate book' },
      { status: 500 }
    );
  }
}