import { NextResponse } from 'next/server';
import { filmApi } from '@/lib/filmApi';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (idsParam) {
      // Fetch specific films by IDs
      const ids = idsParam.split(',').filter(id => id.trim());
      const allFilms = await filmApi.getAllFilms();
      const filteredFilms = allFilms.filter(film => ids.includes(film.id));
      return NextResponse.json(filteredFilms);
    } else {
      // Fetch all films
      const films = await filmApi.getAllFilms();
      return NextResponse.json(films);
    }
  } catch (error) {
    console.error('Films API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch films' },
      { status: 500 }
    );
  }
}
