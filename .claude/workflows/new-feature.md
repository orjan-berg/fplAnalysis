# New Feature Workflow

Complete workflow for implementing a new feature using Superpowers methodology.

## Overview

This workflow guides you through planning, developing, testing, and merging a new feature.

**Estimated time:** 30-120 minutes (depending on feature complexity)

---

## Phase 1: DESIGN (5-15 min)

### Step 1a: Define Feature

Answer these questions:
```
What does this feature do?
├─ User story: "As a..., I want to..., so that..."
├─ Scope: What's included? What's not?
└─ Success criteria: How do you know it works?

Who uses this feature?
├─ Internal (developers)?
├─ End users (FPL fans)?
└─ Both?

Where does it appear in the app?
├─ New page?
├─ New component in existing page?
├─ Updated existing component?
└─ Where in navigation?
```

### Step 1b: Run Planning Command

```bash
/plan "Feature name

SCOPE:
- What it does
- Who uses it
- Where it appears

AFFECTED FILES:
- app/components/...
- app/api/...

DEPENDENCIES:
- What exists?
- What needs creating?

RISKS:
- Low/Medium/High
- Specific concerns"
```

### Step 1c: Get Approval

Wait for explicit approval before proceeding. If user says:
- "Looks good" → Proceed to Phase 2 ✅
- "Let's adjust..." → Update plan and re-run
- "Too complex" → Break into smaller features

---

## Phase 2: ISOLATED DEVELOPMENT (2 min)

### Step 2a: Create Feature Branch

```bash
# Feature naming convention: feature/descriptive-name
git checkout -b feature/your-feature-name
```

### Step 2b: Setup Task Tracking

Open TodoWrite and create task list from plan:

```
FEATURE NAME
============

SETUP
[ ] Create required files
[ ] Add TypeScript types
[ ] Setup props/interfaces

IMPLEMENTATION
[ ] Phase 1 - Core logic
[ ] Phase 2 - UI/Styling
[ ] Phase 3 - Integration

TESTING
[ ] Test desktop (1920px)
[ ] Test tablet (768px)
[ ] Test mobile (400px)
[ ] Test edge cases
[ ] Regression testing

QUALITY
[ ] Code review (/code-review)
[ ] Fix any findings
[ ] Final verification

MERGE
[ ] Commit with message
[ ] Merge to main
[ ] Cleanup
```

---

## Phase 3: IMPLEMENTATION (15-60 min)

### Step 3a: Start Dev Server

```bash
npm run dev
# Opens http://localhost:3000
```

### Step 3b: Implement Task by Task

For each task:

1. **RED** - Write test/spec (what should this do?)
2. **GREEN** - Make it work (minimal code)
3. **REFACTOR** - Make it clean (simplify/optimize)
4. **VERIFY** - Test in browser immediately

### Step 3c: Mark Tasks Complete

As each task is done:
```bash
TodoWrite  # Mark task [x] complete
```

### Step 3d: Commit Progress

After logical chunks:
```bash
git add app/components/NewComponent.tsx
git commit -m "WIP: Add NewComponent structure"
```

---

## Phase 4: TESTING (10-20 min)

### Step 4a: Manual Testing - Desktop

**Screen size: 1920px (default)**

```
[ ] Component loads without errors
[ ] All data displays correctly
[ ] All interactive elements work
[ ] Layout looks good
[ ] Colors/styling match design
[ ] No console errors (F12)
```

### Step 4b: Manual Testing - Tablet

**Use DevTools: F12 → Ctrl+Shift+M → Select iPad (768px)**

```
[ ] Layout adapts to 768px width
[ ] No horizontal scrolling
[ ] Text is readable
[ ] Buttons are touchable
[ ] Navigation works on touch
```

### Step 4c: Manual Testing - Mobile

**Use DevTools: Select iPhone SE (375px)**

```
[ ] Layout stacks vertically
[ ] No horizontal scrolling
[ ] Text is readable (not tiny)
[ ] Buttons are 44x44px minimum
[ ] All interactions work
```

### Step 4d: Regression Testing

```
[ ] Navigate to other features
[ ] Verify no visual breakage
[ ] Verify sidebar/menu works
[ ] Verify other components render
[ ] Check forms/inputs still work
```

### Step 4e: Edge Cases

```
[ ] Test with empty data
[ ] Test with large data
[ ] Test with missing fields
[ ] Test error states
[ ] Test loading states
```

---

## Phase 5: CODE REVIEW (10 min)

### Step 5a: Prepare for Review

```bash
# Verify clean diff
git status

# Review all changes
git diff

# All committed?
git log --oneline main..HEAD
```

### Step 5b: Run Code Review

```bash
/code-review
```

### Step 5c: Address Findings

For each finding:
1. Read the issue carefully
2. Understand why it matters
3. Fix the code
4. Test in browser
5. Commit the fix

### Step 5d: Re-review if Major Changes

If you changed significant logic:
```bash
/code-review
```

---

## Phase 6: FINAL VERIFICATION (5 min)

### Step 6a: Verify All Requirements

```
CODE QUALITY
[ ] No TypeScript errors
[ ] No console.log statements
[ ] No unused imports
[ ] Comments explain WHY
[ ] Follows naming conventions

TESTING
[ ] Desktop tested (1920px)
[ ] Tablet tested (768px)
[ ] Mobile tested (375px)
[ ] Edge cases tested
[ ] Regression tested

DOCUMENTATION
[ ] CLAUDE.md updated (if needed)
[ ] Code comments added
[ ] Commit message clear

GIT STATUS
[ ] All changes staged
[ ] Commit message complete
[ ] No uncommitted changes
```

### Step 6b: Verify Tasks Complete

```bash
TodoWrite --check-all
# All tasks should have [x]
```

---

## Phase 7: MERGE (5 min)

### Step 7a: Prepare Main Branch

```bash
# Switch to main
git checkout main

# Update from remote
git pull origin main

# Switch back to feature
git checkout feature/your-feature-name
```

### Step 7b: Final Test on Main

```bash
# Rebase on latest main
git rebase main

# Resolve conflicts if any (usually none)

# Test one more time
npm run dev
# ... test in browser quickly ...
```

### Step 7c: Merge to Main

```bash
# Switch to main
git checkout main

# Merge feature
git merge --no-ff feature/your-feature-name
```

### Step 7d: Cleanup

```bash
# Delete feature branch
git branch -d feature/your-feature-name

# Push to remote
git push origin main
```

---

## Troubleshooting

### Problem: Code Review Findings

**Solution:**
1. Read finding carefully
2. Fix the issue
3. Test in browser
4. Commit fix: `git commit -m "Fix: code review finding"`
5. Re-run: `/code-review`

### Problem: Merge Conflict

**Solution:**
```bash
# View conflicts
git status

# Edit conflicted files
# ... remove conflict markers ...

# Mark resolved
git add .

# Complete merge
git commit -m "Merge main"
```

### Problem: Failing Manual Tests

**Solution:**
1. Debug in browser (F12)
2. Check console for errors
3. Verify data is correct
4. Fix code
5. Test again

---

## Quick Reference Checklist

Use this before merging:

```
BEFORE MERGE:
[ ] All tasks in TodoWrite complete
[ ] Code review run and findings addressed
[ ] Desktop testing done (1920px)
[ ] Tablet testing done (768px)
[ ] Mobile testing done (375px)
[ ] Regression testing done
[ ] No console errors
[ ] No console.log statements
[ ] Commit message clear
[ ] CLAUDE.md updated (if needed)
[ ] All changes staged
[ ] Ready to merge!
```

---

## Success Metrics

After feature is merged, verify:

✅ Feature appears in app as planned
✅ No regressions in other features
✅ Works on all screen sizes
✅ Handles edge cases gracefully
✅ Code is clean and maintainable

Celebrate! 🎉 Your feature is live!

