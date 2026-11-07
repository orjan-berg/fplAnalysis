export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');

    if (!event) {
      return Response.json(
        { error: 'Missing event parameter' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://fantasy.premierleague.com/api/event/${event}/live/`);
    if (!response.ok) {
      throw new Error('Failed to fetch event live data');
    }

    const data = await response.json();

    // Extract captain statistics for all players
    const captainStats: Record<number, { selected_by: number; selected_by_type: Record<string, number> }> = {};
    const points: Record<number, number> = {};

    if (data.elements) {
      data.elements.forEach((element: any) => {
        captainStats[element.id] = {
          selected_by: element.selected_by || 0,
          selected_by_type: element.selected_by_type || {},
        };
        points[element.id] = element.stats?.total_points || 0;
      });
    }

    return Response.json({
      captainStats,
      points,
      total_elements: data.elements?.length || 0,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
