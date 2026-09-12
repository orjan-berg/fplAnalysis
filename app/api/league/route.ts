import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get('id');
  const page = searchParams.get('page') || '1';

  if (!leagueId) {
    return NextResponse.json({ error: 'League ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=${page}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'League not found' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch league data' }, { status: 500 });
  }
}
