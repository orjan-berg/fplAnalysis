export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${id}/transfers/`);
    if (!response.ok) {
      throw new Error('Failed to fetch transfers from FPL API');
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
