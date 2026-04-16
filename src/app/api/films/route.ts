import { NextResponse } from 'next/server';
import { filmApi } from '@/lib/filmApi';

export async function GET() {
  try {
    const films = await filmApi.getAllFilms();
    return NextResponse.json(films);
  } catch (error) {
    console.error('Films API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch films' },
      { status: 500 }
    );
  }
}
