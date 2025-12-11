import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { books } from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if book exists and is public
    const book = await db
      .select({
        id: books.id,
        title: books.title,
        description: books.description,
        content: books.content,
        genre: books.genre,
        authorName: books.authorName,
        createdAt: books.createdAt,
        isPublic: books.isPublic,
        downloadCount: books.downloadCount,
        viewCount: books.viewCount
      })
      .from(books)
      .where(
        and(
          eq(books.id, id),
          eq(books.isPublic, true)
        )
      )
      .limit(1);

    if (book.length === 0) {
      return NextResponse.json(
        { error: 'Book not found or not public' },
        { status: 404 }
      );
    }

    // Increment view count
    await db
      .update(books)
      .set({ 
        viewCount: book[0].viewCount + 1 
      })
      .where(eq(books.id, id));

    return NextResponse.json({
      ...book[0],
      viewCount: book[0].viewCount + 1
    }, { status: 200 });

  } catch (error) {
    console.error('Share GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get request body
    const body = await request.json();
    const { action } = body;

    if (action === 'download') {
      // Increment download count
      await db
        .execute(
          // Using raw SQL since Drizzle doesn't support increment in this case
          `UPDATE books SET download_count = download_count + 1 WHERE id = '${id}'`
        );
    } else if (action === 'like') {
      // Handle likes (you might have a separate likes table)
      // For now, we'll just return success
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Share POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}