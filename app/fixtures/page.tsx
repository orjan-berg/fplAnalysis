'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import FixtureDifficultyGrid from '@/app/components/FixtureDifficultyGrid';

export default function FixturesPage() {
  const router = useRouter();
  const [currentEvent, setCurrentEvent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current gameweek
    const fetchCurrentEvent = async () => {
      try {
        const res = await fetch('/api/bootstrap');
        if (!res.ok) throw new Error('Failed to fetch bootstrap data');
        const data = await res.json();

        const currentGw = data.events.find((e: any) => !e.finished)?.id ||
                         data.events[data.events.length - 1]?.id || 1;
        setCurrentEvent(currentGw);
      } catch (err) {
        console.error('Failed to fetch current event:', err);
        setCurrentEvent(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentEvent();
  }, []);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="bg-blue-600 text-white py-8 shadow">
        <div className="max-w-full mx-auto px-4">
          <h1 className="text-4xl font-bold">FPL Fixture Difficulty</h1>
          <p className="text-blue-100 mt-2">View fixture difficulty ratings for upcoming gameweeks</p>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white shadow-lg">
          <nav className="p-6 space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-6 px-2">Meny</h3>
            <button
              onClick={() => router.back()}
              className="w-full text-left px-4 py-3 rounded-lg transition font-medium text-gray-700 hover:bg-gray-100"
            >
              ← Tilbake
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-full mx-auto px-4 py-8">
            <FixtureDifficultyGrid startEvent={currentEvent} />
          </div>
        </main>
      </div>
    </div>
  );
}
