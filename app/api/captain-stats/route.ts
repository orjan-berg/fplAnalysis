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

    const response = await fetch(`https://fantasy.premierleague.com/api/event/${event}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch event data from FPL API');
    }

    const data = await response.json();

    // Return relevant captain statistics
    return Response.json({
      event: event,
      most_captained: data.most_captained,
      most_captained_by: data.most_captained_by || 0,
      most_vice_captained: data.most_vice_captained,
      most_vice_captained_by: data.most_vice_captained_by || 0,
      chip_plays: data.chip_plays || [],
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
