import { NextRequest, NextResponse } from 'next/server';
import { filmApi } from '@/lib/filmApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const films = await filmApi.searchFilms(query);
    return NextResponse.json(films);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search films' },
      { status: 500 }
    );
  }
}
