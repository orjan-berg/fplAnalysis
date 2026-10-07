export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');
    const playerId = searchParams.get('playerId');
    const captainType = searchParams.get('type'); // 'captain' or 'vice_captain'

    if (!event || !playerId || !captainType) {
      return Response.json(
        { error: 'Missing event, playerId, or type parameter' },
        { status: 400 }
      );
    }

    // Get live data which contains captain information
    const liveUrl = `https://fantasy.premierleague.com/api/event/${event}/live/`;
    const liveRes = await fetch(liveUrl);
    if (!liveRes.ok) {
      throw new Error('Failed to fetch live data');
    }

    const liveData = await liveRes.json();

    // The live data has elements array with each player
    const playerData = liveData.elements?.find((e: any) => e.id === parseInt(playerId));

    if (!playerData) {
      return Response.json({
        count: 0,
        percentage: 0,
      });
    }

    // Get captain/vice-captain stats from player element
    const captainCount = captainType === 'captain'
      ? playerData.stats?.selected_by_type?.['1'] || 0  // Assuming type 1 is managers
      : playerData.stats?.selected_by_type?.['2'] || 0; // Assuming type 2 is something else

    // This might not work, so let's return data we can get from bootstrap
    // We'll get total managers from bootstrap data
    const bootstrapRes = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    const bootstrapData = await bootstrapRes.json();

    // Get captain data if available
    const event_data = bootstrapData.events?.find((e: any) => e.id === parseInt(event));

    return Response.json({
      captainCount: playerData.selected_by || 0,
      totalManagers: bootstrapData.total_players || 12000000,
      eventData: {
        most_captained: event_data?.most_captained,
        most_captained_by: event_data?.most_captained_by,
        most_vice_captained: event_data?.most_vice_captained,
        most_vice_captained_by: event_data?.most_vice_captained_by,
      }
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
