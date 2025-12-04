import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const {
      title,
      genre,
      audience,
      description,
      tone,
      style,
      chapters,
      wordsPerChapter
    } = body;

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json(
        {
          error: 'User ID cannot be provided in request body',
          code: 'USER_ID_NOT_ALLOWED'
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !title ||
      !genre ||
      !audience ||
      !description ||
      !tone ||
      !style ||
      chapters === undefined ||
      wordsPerChapter === undefined
    ) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const chaptersNum = parseInt(chapters);
    const wordsPerChapterNum = parseInt(wordsPerChapter);

    if (isNaN(chaptersNum) || isNaN(wordsPerChapterNum) || chaptersNum <= 0 || wordsPerChapterNum <= 0) {
      return NextResponse.json(
        {
          error: 'Chapters and wordsPerChapter must be positive numbers',
          code: 'INVALID_NUMERIC_FIELDS'
        },
        { status: 400 }
      );
    }

    // Calculate total words
    const totalWords = chaptersNum * wordsPerChapterNum;

    // Generate mock book content
    const mockChapters = Array.from({ length: chaptersNum }, (_, index) => ({
      number: index + 1,
      title: `Chapter ${index + 1}`,
      content: `Mock content for chapter ${index + 1}. This is a placeholder chapter with approximately ${wordsPerChapterNum} words. The chapter explores themes related to ${genre} and is written in a ${tone} tone with ${style} style. This content is intended for ${audience} audience.`
    }));

    const content = JSON.stringify({ chapters: mockChapters });

    // Auto-generate timestamps
    const now = new Date().toISOString();

    // Insert book into database
    const newBook = await db
      .insert(books)
      .values({
        userId,
        title: title.trim(),
        genre: genre.trim(),
        audience: audience.trim(),
        description: description.trim(),
        tone: tone.trim(),
        style: style.trim(),
        chapters: chaptersNum,
        wordsPerChapter: wordsPerChapterNum,
        totalWords,
        status: 'completed',
        content,
        coverUrl: null,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Return created book
    return NextResponse.json(newBook[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}