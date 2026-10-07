export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');

    const url = event
      ? `https://fantasy.premierleague.com/api/fixtures/?event=${event}`
      : 'https://fantasy.premierleague.com/api/fixtures/';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch fixtures from FPL API');
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
