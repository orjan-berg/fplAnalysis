import { NextResponse } from 'next/server';

const FPL_API = 'https://fantasy.premierleague.com/api';

export const revalidate = 300;

interface LiveElement {
  id: number;
  stats: { minutes: number; total_points: number };
}

export async function GET() {
  try {
    const bootstrapRes = await fetch(`${FPL_API}/bootstrap-static/`, { next: { revalidate: 300 } });
    if (!bootstrapRes.ok) throw new Error('Failed to fetch bootstrap data');
    const bootstrap = await bootstrapRes.json();

    const finishedGws: number[] = bootstrap.events
      .filter((e: any) => e.finished && e.data_checked)
      .map((e: any) => e.id);

    const liveByGw = await Promise.all(
      finishedGws.map(async (gw) => {
        const res = await fetch(`${FPL_API}/event/${gw}/live/`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Failed to fetch live data for GW${gw}`);
        const data = await res.json();
        return { gw, elements: data.elements as LiveElement[] };
      })
    );

    const history = new Map<number, { played: number; blankGws: number[] }>();
    for (const { gw, elements } of liveByGw) {
      for (const el of elements) {
        const { minutes, total_points } = el.stats;
        if (minutes <= 0) continue;

        const entry = history.get(el.id) ?? { played: 0, blankGws: [] };
        entry.played++;
        // Minutes points are 2 for 60+ minutes and 1 for under 60; anything beyond that is not blank
        if (total_points === (minutes >= 60 ? 2 : 1)) entry.blankGws.push(gw);
        history.set(el.id, entry);
      }
    }

    const teamShortNames = new Map<number, string>(
      bootstrap.teams.map((t: any) => [t.id, t.short_name])
    );

    const players = bootstrap.elements
      .filter((p: any) => history.has(p.id))
      .map((p: any) => {
        const h = history.get(p.id)!;
        return {
          id: p.id,
          web_name: p.web_name,
          team: teamShortNames.get(p.team) ?? '',
          element_type: p.element_type,
          price: p.now_cost / 10,
          total_points: p.total_points,
          played: h.played,
          blankGws: h.blankGws,
        };
      });

    return NextResponse.json({ finishedGws, players });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
