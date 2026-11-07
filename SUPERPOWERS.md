# Superpowers Development Methodology

This project uses the **Superpowers** framework for structured AI-assisted development. Superpowers provides a systematic workflow for breaking down complex features into manageable tasks with built-in quality checks.

---

## 🎯 Core Principles

1. **Deliberate Design** - Plan before coding
2. **Isolation** - Use branches and worktrees for isolation
3. **Task Atomicity** - Break work into 2-5 minute chunks
4. **Test-First** - Write tests/requirements before implementation
5. **Code Review** - Systematic quality verification
6. **Documentation** - Keep CLAUDE.md updated

---

## 🔄 The Development Cycle

### Phase 1: DESIGN

**Goal:** Clarify requirements and validate approach

```bash
# Start a plan
/plan "Feature name and description"
```

**During Planning:**
- Define what the feature does
- List affected files/components
- Identify dependencies and constraints
- Validate complexity level
- Get explicit user approval on approach

**Example:**
```
/plan "Add xG statistics display to fixtures view

- Show expected goals for each team
- Fetch from API endpoint /api/fixtures-xg
- Display as badge next to difficulty rating
- No changes to API routes needed
- Affects: FixtureDifficultyGrid component only"
```

### Phase 2: ISOLATED DEVELOPMENT

**Goal:** Work on feature in isolation using git

```bash
# Create feature branch
git checkout -b feature/descriptive-name

# Make changes in isolation
# Push regularly (safe because isolated)

# When ready for review
git push origin feature/descriptive-name
```

**Branch Naming:**
- `feature/` for new features
- `fix/` for bug fixes
- `refactor/` for code cleanup

### Phase 3: TASK BREAKDOWN

**Goal:** Split feature into small, atomic tasks

```bash
# List all tasks
TodoWrite

# Example task list:
# [ ] Create API endpoint /api/fixtures-xg
# [ ] Add types for xG data
# [ ] Fetch xG data in component
# [ ] Render xG badge in UI
# [ ] Test in browser at 3 breakpoints
# [ ] Code review before merge
```

**Task Characteristics:**
- ✅ Completable in 2-5 minutes
- ✅ Produces one atomic change
- ✅ Can be verified immediately
- ✅ Dependencies are clear
- ❌ Avoid "nice to haves" in tasks
- ❌ Avoid bundling unrelated work

### Phase 4: IMPLEMENTATION (RED-GREEN-REFACTOR)

**For Each Task:**

#### RED (Write the test/spec)
```typescript
// What should this do?
// What are the inputs/outputs?
// What could go wrong?
```

#### GREEN (Make it work)
```typescript
// Write the minimal code to make it work
// Don't worry about perfection yet
```

#### REFACTOR (Make it clean)
```typescript
// Simplify the code
// Remove duplication
// Improve readability
```

**Manual Testing for UI Components:**
1. Run `npm run dev`
2. Navigate to the component
3. Test the golden path (happy path)
4. Test edge cases
5. Check responsiveness (mobile/tablet/desktop)
6. Look for regressions in other features

### Phase 5: CODE REVIEW

**Before Merging:**

```bash
# Run code review
/code-review

# Address findings
# Update code if needed
# Re-run review if major changes
```

**Code Review Checks:**
- ✅ Correctness - Does it work as intended?
- ✅ Simplification - Can it be simpler?
- ✅ Consistency - Follows project patterns?
- ✅ Testing - Manual verification completed?
- ✅ Performance - No obvious inefficiencies?

### Phase 6: MERGE

**Cleanup & Integration:**

```bash
# Ensure all tasks completed
TodoWrite --check-all

# Stage relevant files only
git add app/components/NewComponent.tsx
git add app/api/new-endpoint/route.ts

# Commit with clear message
git commit -m "Add feature name

- Specific change 1
- Specific change 2
- Specific change 3"

# Switch to main
git checkout main

# Merge feature
git merge feature/descriptive-name

# Delete feature branch
git branch -d feature/descriptive-name
```

---

## 📋 Common Workflows

### Adding a New Component

**Planning:**
```bash
/plan "Create TeamStats component

- Shows: points, rank, bank, transfers
- Props: teamData (required)
- Used in: Team detail page
- No API changes needed
- File: app/components/TeamStats.tsx"
```

**Tasks:**
```
[ ] Create component file with TypeScript types
[ ] Add layout structure with Tailwind classes
[ ] Add data prop and render fields
[ ] Add styling/colors for visual hierarchy
[ ] Test in browser - verify layout/colors
[ ] Test responsive - mobile/tablet/desktop
[ ] Code review for consistency
```

### Fixing a Bug

**Planning:**
```bash
/plan "Fix rank change not showing in leagues

Bug: Rank changes show 0 for all teams
Root cause: last_rank comparison logic is wrong
Fix: Use last_rank directly from API response
Affects: LeagueStandings component only
Risk: Low - isolated change"
```

**Tasks:**
```
[ ] Identify exact lines in component
[ ] Write console.log to verify last_rank value
[ ] Fix comparison logic
[ ] Test with 3 different leagues
[ ] Verify no regressions in other pages
[ ] Code review
```

### Refactoring Code

**Planning:**
```bash
/plan "Extract position color logic to utility function

Current: Duplicate color logic in 3 components
Solution: Create utils/positionColors.ts
Benefit: DRY principle, easier maintenance
Risk: Low - pure refactor, no logic changes"
```

**Tasks:**
```
[ ] Create utils/positionColors.ts with function
[ ] Update component 1 to use utility
[ ] Update component 2 to use utility
[ ] Update component 3 to use utility
[ ] Verify all components still render correctly
[ ] Code review for simplification
```

---

## ✅ Quality Checklist

Before marking a feature complete:

### Code Quality
- [ ] No unused imports
- [ ] No console.log left in
- [ ] Consistent naming (web_name, not first_name + second_name)
- [ ] Comments explain WHY, not WHAT
- [ ] No hardcoded values (use constants)

### Testing
- [ ] Tested in browser on desktop
- [ ] Tested on mobile width (~400px)
- [ ] Tested on tablet width (~768px)
- [ ] Tested happy path (normal data)
- [ ] Tested with edge cases (empty data, errors)
- [ ] Checked for regressions in other features

### Documentation
- [ ] CLAUDE.md updated if applicable
- [ ] Code comments added for non-obvious logic
- [ ] Commit message is clear and descriptive
- [ ] Feature integrated into sidebar/navigation

### Code Review
- [ ] `/code-review` run and findings addressed
- [ ] No new TypeScript errors
- [ ] No new linting issues
- [ ] Follows project patterns/conventions

---

## 🛠️ Tools & Commands

### Planning
```bash
/plan "Feature description"    # Plan feature
EnterPlanMode                  # Detailed planning
ExitPlanMode                   # Finalize plan
```

### Task Management
```bash
TodoWrite                      # Create/update task list
TodoWrite --check-all         # Verify all tasks done
```

### Development
```bash
npm run dev                    # Start dev server
git status                     # Check changes
git diff                       # Review changes
/code-review                   # Review code quality
```

### Git
```bash
git checkout -b feature/name   # Create branch
git add .                      # Stage changes
git commit -m "message"        # Commit
git push origin feature/name   # Push to remote
```

---

## 📊 Metrics & Feedback

### What to Track

- **Time per task** - Are tasks actually 2-5 minutes?
- **Task accuracy** - Do tasks get completed as planned?
- **Code review findings** - What types of issues are caught?
- **Regressions** - Are new features breaking old ones?
- **Browser testing** - Are all features working visually?

### Feedback Loop

After each feature:
1. Did the plan match reality?
2. Were task estimates accurate?
3. What could be improved next time?
4. Update CLAUDE.md if patterns change

---

## 🚫 Common Pitfalls to Avoid

1. **Skipping the plan** → Features go off-scope
   - Always run `/plan` first, get approval

2. **Tasks too large** → Hard to verify completion
   - Keep tasks to 2-5 minutes max

3. **Skipping browser testing** → UI bugs missed
   - Always test in real browser, not just code

4. **Merging without code review** → Quality issues accumulate
   - Always run `/code-review` before merge

5. **Not updating documentation** → Future self gets confused
   - Keep CLAUDE.md in sync with current code

6. **Breaking isolation** → Hard to revert changes
   - Work in feature branches, not directly on main

---

## 🎓 Learning Resources

- **Superpowers Official:** https://github.com/obra/superpowers
- **This Project:** See CLAUDE.md for architecture
- **Next.js:** https://nextjs.org/docs
- **FPL API:** https://fantasy.premierleague.com/api/

---

## 💡 Tips for Success

1. **Read CLAUDE.md before starting** - Understand the project
2. **Start with `/plan`** - Clarify scope before coding
3. **Use TodoWrite religiously** - Track every task
4. **Test in browser early** - Catch UI issues fast
5. **Code review before merge** - Catch quality issues
6. **Keep tasks small** - 2-5 minutes per task
7. **Commit atomically** - One logical change per commit
8. **Update docs as you go** - Don't do it at the end

