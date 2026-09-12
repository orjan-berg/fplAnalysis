import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('id');

  if (!entryId) {
    return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${entryId}/`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Team not found' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
  }
}
