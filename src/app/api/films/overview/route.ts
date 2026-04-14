import { NextRequest, NextResponse } from 'next/server';
import { filmApi } from '@/lib/filmApi';
import { aiOverview } from '@/lib/aiOverview';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filmId } = body;

    if (!filmId) {
      return NextResponse.json(
        { error: 'Film ID is required' },
        { status: 400 }
      );
    }

    const filmDetails = await filmApi.getFilmDetails(filmId);
    if (!filmDetails) {
      return NextResponse.json(
        { error: 'Film not found' },
        { status: 404 }
      );
    }

    const overview = await aiOverview.generateOverview(filmDetails);

    return NextResponse.json({
      filmId,
      title: filmDetails.title,
      overview,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Overview API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate overview' },
      { status: 500 }
    );
  }
}
