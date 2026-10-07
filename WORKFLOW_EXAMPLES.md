# Superpowers Workflow Examples

This document shows real examples of how to use the Superpowers methodology for common FPL project tasks.

---

## Example 1: Adding a New Component

### Scenario
You want to add a "Player Stats" component showing detailed statistics for a selected player.

### Step 1: DESIGN (/plan)

```bash
/plan "Create PlayerStats component for detailed player view

SCOPE:
- Display: goals, assists, clean sheets, minutes, form, cost
- Input: playerId (number)
- Fetch from: bootstrap API
- Display as: card with Tailwind styling
- Used in: Modal or detail page

AFFECTED FILES:
- NEW: app/components/PlayerStats.tsx
- MAYBE: app/page.tsx (if adding modal)

DEPENDENCIES:
- Bootstrap API already fetches player data
- No new API routes needed

COMPLEXITY:
- Low - self-contained component
- No state management needed
- Simple data mapping

RISKS:
- None identified"
```

### Step 2: CREATE FEATURE BRANCH

```bash
git checkout -b feature/player-stats-component
```

### Step 3: BREAK DOWN INTO TASKS (TodoWrite)

```
PLAYER STATS COMPONENT
=====================

SETUP
[ ] Create app/components/PlayerStats.tsx file
[ ] Define TypeScript interfaces for props

IMPLEMENTATION - PHASE 1 (Structure)
[ ] Create basic component structure
[ ] Add prop types (playerId)
[ ] Add useState for player data
[ ] Add useEffect to fetch bootstrap data

IMPLEMENTATION - PHASE 2 (Data Handling)
[ ] Filter bootstrap data for selected player
[ ] Extract relevant fields (goals, assists, etc.)
[ ] Handle loading state
[ ] Handle error state

IMPLEMENTATION - PHASE 3 (UI)
[ ] Create card layout with Tailwind
[ ] Display all fields with labels
[ ] Add color coding (form: green/yellow/red)
[ ] Make responsive (mobile/tablet/desktop)

TESTING - MANUAL
[ ] Test on desktop (1920px) - verify layout
[ ] Test on tablet (768px) - verify responsive
[ ] Test on mobile (400px) - verify stacking
[ ] Test with real data (Haaland, De Bruyne)
[ ] Test with edge cases (0 goals, 0 assists)
[ ] Test error state (invalid playerId)

QUALITY
[ ] Run code review with /code-review
[ ] Address any findings
[ ] Verify no TypeScript errors
[ ] Verify no console.log statements

MERGE
[ ] Commit with clear message
[ ] Merge to main
[ ] Delete feature branch
```

### Step 4: IMPLEMENTATION

#### Task: Create component structure

```typescript
// app/components/PlayerStats.tsx
'use client';

import { useState, useEffect } from 'react';

interface Player {
  id: number;
  web_name: string;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  minutes: number;
  form: string;
  now_cost: number;
}

interface PlayerStatsProps {
  playerId: number;
}

export default function PlayerStats({ playerId }: PlayerStatsProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/bootstrap');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const found = data.elements.find((p: any) => p.id === playerId);
        setPlayer(found || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    };

    if (playerId) fetchPlayer();
  }, [playerId]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!player) return <div className="p-4">No player found</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4 max-w-md">
      <div className="col-span-2">
        <h3 className="text-xl font-bold text-gray-900">{player.web_name}</h3>
      </div>
      <div>
        <p className="text-sm text-gray-600">Goals</p>
        <p className="text-2xl font-bold text-blue-600">{player.goals_scored}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Assists</p>
        <p className="text-2xl font-bold text-green-600">{player.assists}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Clean Sheets</p>
        <p className="text-2xl font-bold text-yellow-600">{player.clean_sheets}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Minutes</p>
        <p className="text-2xl font-bold text-purple-600">{player.minutes}</p>
      </div>
    </div>
  );
}
```

✅ Task complete!

#### Task: Test on desktop

1. Run `npm run dev`
2. Open browser at `http://localhost:3000`
3. Import component in a test page
4. Verify layout looks correct
5. Verify all fields display
6. Check colors are visible

✅ Task complete!

#### Task: Test on mobile

1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select "iPhone SE" (375px width)
4. Verify layout stacks vertically
5. Verify text is readable
6. Verify no horizontal scroll

✅ Task complete!

### Step 5: CODE REVIEW

```bash
/code-review
```

Expected findings: None (simple component)

### Step 6: MERGE

```bash
# Verify all tasks are complete
TodoWrite --check-all

# Stage the new file
git add app/components/PlayerStats.tsx

# Commit with clear message
git commit -m "Add PlayerStats component for detailed player view

- Display goals, assists, clean sheets, minutes
- Responsive design (mobile/tablet/desktop)
- Fetches from bootstrap API
- Tested on 3 screen sizes"

# Switch to main
git checkout main

# Merge feature
git merge feature/player-stats-component

# Delete feature branch (optional but clean)
git branch -d feature/player-stats-component
```

---

## Example 2: Fixing a Bug

### Scenario
Users report that most captained players show 0% instead of the actual percentage.

### Step 1: DESIGN (/plan)

```bash
/plan "Fix most captained player percentage display

BUG REPORT:
- Feature: GW Most Captained players
- Issue: Shows 0% for all players
- Expected: Show percentage of managers who captained them
- Affected: MostCaptained component

ROOT CAUSE ANALYSIS:
- API field 'most_captained_by' doesn't exist in bootstrap
- Code tries to calculate: (count / total) * 100
- But 'count' is always undefined
- So: (undefined / 12000000) * 100 = 0

SOLUTION:
- Use event-live API which has captain statistics
- Fetch from /api/event-live?event=current
- Display team name instead of percentage (FPL doesn't provide %)

AFFECTED FILES:
- app/components/MostCaptained.tsx

TESTING:
- Verify no API changes needed
- Check if event-live already implemented
- Test with real captain data"
```

### Step 2: CREATE BRANCH

```bash
git checkout -b fix/most-captained-percentage
```

### Step 3: BREAK DOWN INTO TASKS

```
MOST CAPTAINED PERCENTAGE FIX
=============================

ANALYSIS
[ ] Check current component code
[ ] Verify event-live API structure
[ ] Confirm captain count availability
[ ] Document data transformation needed

FIX - PHASE 1
[ ] Fetch event-live data for captain stats
[ ] Extract captain count for selected player
[ ] Calculate total managers from API

FIX - PHASE 2
[ ] Update component to display team name
[ ] Add fallback if counts unavailable
[ ] Format percentage display (XX%)

TESTING
[ ] Test with Haaland (most captained)
[ ] Test with De Bruyne
[ ] Verify percentages make sense (0-100%)
[ ] Check loading/error states

REVIEW
[ ] Run /code-review
[ ] Verify no console.log left
[ ] Check for TypeScript errors

MERGE
[ ] Commit fix
[ ] Merge to main
[ ] Verify in browser
```

### Step 4: IMPLEMENTATION & TESTING

[Follow same pattern as Example 1]

---

## Example 3: Refactoring Code

### Scenario
You notice position color logic is duplicated in 3 components.

### Step 1: DESIGN (/plan)

```bash
/plan "Extract duplicate position color logic to utility

DUPLICATION:
- Components: TransferAnalysis, TeamSquad, DreamTeam
- Logic: Get color based on element_type (1-4)
- Issue: Same switch/object in 3 places = maintenance burden

SOLUTION:
- Create: app/utils/positionColors.ts
- Export: getPositionColor(elementType: number) → string
- Update: All 3 components to use utility

BENEFITS:
- Single source of truth
- Easier to add new positions
- Consistent across app

RISK:
- Low - pure refactor, no logic changes
- Just extracting existing code"
```

### Step 2: CREATE BRANCH

```bash
git checkout -b refactor/extract-position-colors
```

### Step 3: TASKS

```
EXTRACT POSITION COLORS
=======================

CREATE UTILITY
[ ] Create app/utils/positionColors.ts
[ ] Define getPositionColor function
[ ] Add TypeScript types
[ ] Export for use in components

UPDATE COMPONENTS
[ ] Update TransferAnalysis to use utility
[ ] Update TeamSquad to use utility
[ ] Update DreamTeam to use utility
[ ] Remove old color logic from each

TESTING
[ ] Verify each component renders correctly
[ ] Check colors are the same as before
[ ] Verify no visual changes

QUALITY
[ ] Run /code-review
[ ] Verify no new errors

MERGE
[ ] Commit refactor
[ ] Merge to main
```

---

## Template: Your Own Feature

Use this template for your next feature:

```bash
# Step 1: Plan
/plan "Brief description

SCOPE:
- What does it do?

AFFECTED FILES:
- app/components/...
- app/api/...

DEPENDENCIES:
- What exists?

RISKS:
- What could go wrong?"

# Step 2: Branch
git checkout -b feature/or-fix/description

# Step 3: Tasks
TodoWrite

# Step 4: Code
# ... implement ...

# Step 5: Review
/code-review

# Step 6: Merge
git add app/components/...
git commit -m "Description

- Bullet 1
- Bullet 2"
git checkout main
git merge feature/description
```

---

## Quick Reference

| Phase | Command | Purpose |
|-------|---------|---------|
| Design | `/plan "..."` | Clarify requirements |
| Branch | `git checkout -b feature/...` | Isolate work |
| Tasks | `TodoWrite` | Break down work |
| Code | `npm run dev` | Develop & test |
| Review | `/code-review` | Verify quality |
| Merge | `git merge feature/...` | Integrate changes |

---

## Tips

✅ **DO:**
- Write plan first, code second
- Test in browser at 3 screen sizes
- Keep tasks to 2-5 minutes
- Commit frequently with clear messages
- Review code before merging

❌ **DON'T:**
- Skip the plan and dive into code
- Skip browser testing
- Make tasks too large (>5 minutes)
- Merge without code review
- Push to main directly

