# Feature Plan Template

Copy this template when creating a feature plan with `/plan`.

---

## Template

```
/plan "Feature Name - Concise Description

SCOPE:
- What the feature does (user perspective)
- What's included in this feature
- What's NOT included (boundaries)
- User story: As a [user], I want [feature], so that [benefit]

AFFECTED FILES:
- app/components/... (new or modified)
- app/api/... (new or modified)
- app/page.tsx (if navigation changes)

DEPENDENCIES:
- What already exists? (APIs, components, data)
- What needs to be created?
- Any external dependencies?

IMPLEMENTATION APPROACH:
- High-level approach (1-2 paragraphs)
- Any architectural considerations?
- Any concerns about implementation?

RISKS:
- Severity: Low / Medium / High
- Specific concerns
- Mitigation strategies

COMPLEXITY:
- Low (simple component, no new APIs)
- Medium (some new logic, maybe new API)
- High (complex logic, multiple new APIs)

ESTIMATED TIME:
- 30 minutes / 1 hour / 2 hours

TESTING REQUIREMENTS:
- Manual testing on desktop
- Manual testing on tablet/mobile
- Edge cases to test
- Regressions to watch for
"
```

---

## Real Examples

### Example 1: Simple Component

```
/plan "Add LeagueStats component showing league summary

SCOPE:
- Display total teams, average points, rank range
- Show in sidebar below league standings
- No new APIs needed

AFFECTED FILES:
- NEW: app/components/LeagueStats.tsx
- MODIFY: app/page.tsx (import and display)

DEPENDENCIES:
- League data already fetched in main component
- Use existing leagues state

IMPLEMENTATION:
- Create component that accepts league data prop
- Calculate: team count, avg points, min/max rank
- Display as simple 3-stat grid

RISKS:
- Low - isolated component

COMPLEXITY:
- Low

ESTIMATED TIME:
- 20 minutes
"
```

### Example 2: Medium Complexity

```
/plan "Add Injury Report showing injured players

SCOPE:
- Display list of injured players for upcoming gameweeks
- Show injury type, return date, affected teams
- Fetch from new /api/injuries endpoint

AFFECTED FILES:
- NEW: app/api/injuries/route.ts
- NEW: app/components/InjuryReport.tsx
- MODIFY: app/page.tsx (add menu item)
- MODIFY: CLAUDE.md (document new endpoint)

DEPENDENCIES:
- Need external injury data source
- Bootstrap API for player lookup
- Gameweek status for 'current' week

IMPLEMENTATION:
- Create endpoint that maps external data to our schema
- Create component to display injury list
- Sort by return date

RISKS:
- Medium - new API dependency
- External data source reliability?
- Keep fallback if data unavailable

COMPLEXITY:
- Medium

ESTIMATED TIME:
- 1.5 hours
"
```

### Example 3: Complex Feature

```
/plan "Add Player Recommendation Engine using ML

SCOPE:
- Show 'best value' players based on cost/points ratio
- Show transfer recommendations (who to buy/sell)
- Use historical data to predict form trends
- Add to sidebar as 'AI Insights' section

AFFECTED FILES:
- NEW: app/api/recommendations/route.ts
- NEW: app/utils/recommendationEngine.ts
- NEW: app/components/AIInsights.tsx
- MODIFY: app/page.tsx (add menu item)
- MODIFY: CLAUDE.md (architecture docs)

DEPENDENCIES:
- Historical gameweek data (already fetched)
- Transfer data (already fetched)
- Bootstrap player data
- Chip history data

IMPLEMENTATION:
- Create algorithm in utils/recommendationEngine.ts
- Build API endpoint to serve recommendations
- Cache results to avoid recalculation
- Add component to display results with reasoning

RISKS:
- High - complex algorithm, many edge cases
- Need to test accuracy of recommendations
- Performance: caching is important
- User trust: recommendations must be sound

COMPLEXITY:
- High - multiple algorithms, significant logic

ESTIMATED TIME:
- 2-3 hours

TESTING REQUIREMENTS:
- Test algorithm with known good/bad players
- Verify recommendations make sense
- Test performance (caching works?)
- Edge cases: new players, injured players, etc.
"
```

---

## Using This Template

1. Copy the template above
2. Fill in each section (remove brackets)
3. Be specific - details help clarify scope
4. Get explicit user approval before coding
5. If user says "let's adjust...", update and re-submit

---

## Tips for Good Plans

✅ **SCOPE is Clear**
- Describe from user perspective
- Include boundaries (what's NOT doing)
- One user story, not ten

✅ **AFFECTED FILES are Specific**
- List exact file paths
- Say if new or modified
- No vague descriptions

✅ **RISKS are Real**
- Identify actual concerns
- Not every feature is risky
- Low risk is fine!

✅ **COMPLEXITY is Honest**
- Be realistic about effort
- Break very complex features into smaller ones
- Complexity affects risk

❌ **AVOID:**
- Vague language ("stuff", "things", "etc")
- Scope creep (adding unrelated features)
- Assuming "it's simple" without analysis
- Planning 5+ hour features (break them down)

---

## After Plan is Approved

When user says "Looks good" or "Approved":

1. Create feature branch: `git checkout -b feature/name`
2. Create task list with TodoWrite
3. Implement task by task
4. Test in browser at 3 sizes
5. Run code review: `/code-review`
6. Merge when ready

Ready to start? Ask me to plan the feature! 🚀

