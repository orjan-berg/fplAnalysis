import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch players' }, { status: response.status });
    }

    const data = await response.json();
    // Return elements (players), element_types, and teams
    return NextResponse.json({
      elements: data.elements,
      element_types: data.element_types,
      teams: data.teams,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
