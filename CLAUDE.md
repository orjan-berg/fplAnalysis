# FPL Analysis - Claude Development Guide

## 📋 Project Overview

**FPL Analysis** is a Next.js web application for Fantasy Premier League (FPL) analysis and insights.

**Key Goals:**
- Provide detailed team analysis (squad, transfers, history)
- Display league standings with rank tracking
- Show gameweek points progression and statistics
- Display dream team compositions
- No authentication required - users provide team/league IDs manually

**Tech Stack:**
- Next.js 14 (TypeScript)
- React with Hooks (useState, useEffect)
- Tailwind CSS for styling
- Recharts for data visualization
- FPL API: `fantasy.premierleague.com/api/`

---

## 🏗️ Architecture

### Directory Structure

```
app/
├── api/                          # Server-side API routes (data fetching & caching)
│   ├── bootstrap/               # Global FPL data (players, teams, events, chips)
│   ├── team/                    # Individual team stats
│   ├── league/                  # League standings & rankings
│   ├── picks/                   # Squad for specific gameweek
│   ├── players/                 # Player data with team codes
│   ├── fixtures/                # Fixture difficulty ratings
│   ├── transfers/               # Transfer history
│   ├── entry-history/           # Gameweek-by-gameweek history
│   └── event-live/              # Live captain statistics
├── components/                  # React components
│   ├── TeamForm.tsx            # Entry form
│   ├── TeamInfo.tsx            # Team statistics
│   ├── TeamSquad.tsx           # Squad in 4-3-3 formation
│   ├── LeagueStandings.tsx      # League table with rank changes
│   ├── LeagueHighlights.tsx     # Biggest climber/faller
│   ├── GameweekPointsChart.tsx  # Points progression
│   ├── ChipStats.tsx           # Chip usage stats
│   ├── MostCaptained.tsx       # Most captained players
│   ├── FixtureDifficultyGrid.tsx # Fixture difficulty view
│   ├── Transfers.tsx           # Current GW transfers
│   ├── TransferAnalysis.tsx    # Full transfer history
│   └── DreamTeam.tsx           # Dream team display
├── fixtures/                    # Fixture difficulty page
└── team/[entryId]/             # Individual team page
```

### Data Flow

1. **User Input** → TeamForm component
2. **API Routes** → Fetch from FPL API (cached)
3. **Components** → Render data with user interactions
4. **Local Storage** → Track gameweek changes between page loads

---

## 🚀 Development Process (Superpowers Methodology)

### Feature Development Cycle

1. **DESIGN** - Define requirements and validate with `/plan`
   - Clarify feature scope
   - Identify affected files/components
   - Document any constraints or dependencies

2. **ISOLATED DEVELOPMENT** - Use git branches for isolation
   ```bash
   git checkout -b feature/feature-name
   ```

3. **TASK BREAKDOWN** - Split into 2-5 minute tasks using TodoWrite
   - Each task should produce one atomic change
   - Document dependencies between tasks

4. **IMPLEMENTATION** (RED-GREEN-REFACTOR)
   - Write tests first (if applicable)
   - Implement component/feature
   - Refactor for clarity and reuse
   - Test in browser (manual verification for UI)

5. **CODE REVIEW** - Run `/code-review` before merge
   - Verify correctness
   - Check for simplifications
   - Confirm browser testing completed

6. **MERGE** - Clean up and merge to main
   ```bash
   git checkout main
   git merge feature/feature-name
   ```

---

## 🧪 Testing Strategy

### Component Testing

**Manual Testing Required:**
- All UI components must be tested in the browser
- Test the golden path (happy path)
- Test edge cases and error states
- Monitor for regressions in other features

**How to Test:**
1. Run `npm run dev`
2. Navigate to the feature in browser
3. Interact with all interactive elements
4. Verify data displays correctly
5. Check responsive design (mobile/tablet/desktop)

### API Testing

- API routes have built-in error handling
- FPL API responses are cached where applicable
- Test with invalid IDs to verify error messages

---

## 📊 Current Features

### Views (Accessible via Left Sidebar)

1. **Lag (My Team)**
   - Team information (points, rank, bank, transfers)
   - Squad in 4-3-3 formation with shirt images
   - Gameweek points progression chart

2. **Ligastillinger (League Standings)**
   - League table with all teams
   - Rank changes (+/- from previous GW)
   - Click team name to view their details
   - Biggest climber/faller highlights

3. **Dream Team**
   - All players with `in_dreamteam: true`
   - Organized by position (GK/DEF/MID/FWD)
   - Shows GW points and total season points

4. **Transfer Analyse**
   - All transfers sorted by gameweek (newest first)
   - Net points change (color-coded: green/red)
   - Statistics: total, positive, negative, net points

5. **Fixture Difficulty**
   - Next 10 gameweeks
   - Opponent team codes on colored badges
   - Difficulty rating 1-5 (color-coded)

### Components on Main View

- **GW Chip Usage** - Shows active chips (active flag in data)
- **GW Most Captained** - Most and vice-most captained players

---

## 🛠️ Key Implementation Details

### Important Patterns

**Player Names:**
- Always use `web_name` field from FPL API
- Never use first_name + second_name combination

**Rank Changes:**
- Use `last_rank` field from league standings API
- Only show changes when gameweek is finished (`finished: true`)
- Stored in localStorage for historical comparison

**Shirt Images:**
- URL: `https://resources.premierleague.com/premierleague25/photos/players/110x140/<player.code>.png`
- Size: 110x140 px (scaled down in UI)
- Fallback: Gray placeholder on load error

**Formation Display:**
- Positions: 1=GK, 2=DEF, 3=MID, 4=FWD
- Filter with `pick.position <= 11` for starting XI
- Remaining players go to bench

---

## 🔄 Workflow Commands

### Before Starting Work

```bash
# Plan the feature
/plan "Feature description"

# Create feature branch
git checkout -b feature/your-feature
```

### During Development

```bash
# Track progress
TodoWrite

# Start dev server
npm run dev

# Test in browser at http://localhost:3000
```

### Before Merging

```bash
# Review code
/code-review

# Verify tests/manual testing completed
# Check browser for regressions
```

### After Completion

```bash
# Stage changes
git add app/

# Commit with clear message
git commit -m "Feature description

- Bullet point 1
- Bullet point 2"

# Merge to main
git checkout main
git merge feature/your-feature
```

---

## 📝 Coding Conventions

### Component Structure

```typescript
'use client';

import { useState, useEffect } from 'react';

interface Props {
  // Props definition
}

export default function ComponentName({ prop1 }: Props) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Setup logic
  }, [dependencies]);

  return (
    // JSX
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Color codes: green/red for success/failure, blue for info
- Responsive: mobile-first with `sm:`, `md:`, `lg:` prefixes

### Comments

- Minimal comments - code should be self-explanatory
- Only add WHY, not WHAT
- No multi-line docstrings

### Error Handling

- Validate at system boundaries (user input, API calls)
- Trust internal code and framework guarantees
- Display user-friendly error messages

---

## 🚀 Quick Start for New Features

### Example: Add New Component

1. **Plan** → `/plan "Add new component description"`
2. **Branch** → `git checkout -b feature/new-component`
3. **Tasks** → Use TodoWrite to break down work
4. **Code** → Create component in `app/components/`
5. **Style** → Add Tailwind classes
6. **Test** → Run `npm run dev` and test in browser
7. **Review** → `/code-review` before merge
8. **Merge** → Back to main when ready

---

## 📚 References

- **FPL API:** https://fantasy.premierleague.com/api/
- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com
- **Recharts:** https://recharts.org
- **Superpowers Methodology:** See `SUPERPOWERS.md`

