# Bug Fix Workflow

Complete workflow for diagnosing and fixing bugs using Superpowers methodology.

## Overview

This workflow guides you through investigating, fixing, and verifying a bug is resolved.

**Estimated time:** 15-45 minutes (depending on bug complexity)

---

## Phase 1: DIAGNOSIS (5-10 min)

### Step 1a: Gather Bug Information

Document the bug:
```
BUG REPORT:
- Feature affected: (e.g., "GW Most Captained display")
- Expected behavior: What should happen?
- Actual behavior: What's happening instead?
- Steps to reproduce: How do you trigger it?
- Severity: Critical / High / Medium / Low
- Environment: Desktop / Mobile / Both?
```

### Step 1b: Investigate Root Cause

```
ROOT CAUSE ANALYSIS:
1. Where is the code? (which file/component)
2. What logic is wrong? (trace through code)
3. Why is it wrong? (missing field, wrong calculation, etc.)
4. How can you verify the fix?
```

### Step 1c: Run Planning Command

```bash
/plan "Fix: Brief bug description

BUG:
- What's broken
- What the user sees
- What should happen

ROOT CAUSE:
- Where the bug is
- Why it happens
- What's missing/wrong

FIX:
- How to fix it
- Which files change
- Any side effects?

TESTING:
- How to verify it's fixed
- Edge cases to check
- Regressions to watch for"
```

---

## Phase 2: ISOLATED DEVELOPMENT (2 min)

### Step 2a: Create Bug Fix Branch

```bash
# Naming convention: fix/brief-description
git checkout -b fix/bug-description-here
```

### Step 2b: Setup Task Tracking

```
BUG FIX: Name
==============

DIAGNOSIS
[ ] Identify affected file
[ ] Understand root cause
[ ] Write test to verify bug
[ ] Document expected behavior

FIX IMPLEMENTATION
[ ] Apply minimal fix
[ ] Test fix in browser
[ ] Verify bug is resolved
[ ] Check for side effects

REGRESSION TESTING
[ ] Test related features
[ ] Test edge cases
[ ] Mobile/tablet testing

QUALITY
[ ] Code review (/code-review)
[ ] Address findings
[ ] Final verification

MERGE
[ ] Commit with message
[ ] Merge to main
```

---

## Phase 3: DIAGNOSIS VERIFICATION (3-5 min)

### Step 3a: Reproduce the Bug

1. Start dev server: `npm run dev`
2. Navigate to the broken feature
3. Follow "Steps to reproduce"
4. Verify you see the bug
5. Note exact behavior

### Step 3b: Examine the Code

```bash
# Find the relevant file
grep -r "symptom of bug" app/

# Review the code
# Look for:
# - Wrong variable/field name?
# - Missing null check?
# - Wrong calculation?
# - API not returning expected data?
# - Typo in field name?
```

### Step 3c: Create Test Case

Document how to verify fix:

```typescript
// What should this return?
// Expected: { points: 10, rank: 5 }
// Actual: { points: 10, rank: 0 }

// What's the bug?
// rank field is not being fetched/set correctly
```

---

## Phase 4: IMPLEMENTATION (5-15 min)

### Step 4a: Apply Minimal Fix

Change only what's necessary:

```typescript
// WRONG - Don't refactor while fixing bug
- const points = data.points || 0;
- const rank = calculateRank(data);  // Also refactor this?
+ const rank = data.rank || 0;

// RIGHT - Just fix the bug
+ const rank = data.last_rank || 0;
```

### Step 4b: Test the Fix

1. Save code changes
2. Browser auto-reloads (hot reload)
3. Reproduce the bug scenario
4. Verify bug is fixed
5. Verify data looks correct

### Step 4c: Check for Side Effects

```
REGRESSION CHECK:
[ ] Related features still work?
[ ] Data still displays correctly?
[ ] No new console errors?
[ ] No breaking changes to other components?
```

### Step 4d: Commit the Fix

```bash
git add app/components/BuggyComponent.tsx
git commit -m "Fix: Brief description of bug

- What was wrong
- How it was fixed
- Where to verify the fix"
```

---

## Phase 5: TESTING (5-10 min)

### Step 5a: Reproduce on Desktop

```bash
npm run dev
# Open http://localhost:3000

[ ] Navigate to affected feature
[ ] Verify bug is gone
[ ] Verify data displays correctly
[ ] Check for console errors (F12)
[ ] Test related features for regression
```

### Step 5b: Test on Tablet

```
DevTools: F12 → Ctrl+Shift+M → Select iPad (768px)

[ ] Feature works on tablet width
[ ] No horizontal scrolling
[ ] Data displays correctly
[ ] Touch interactions work
```

### Step 5c: Test on Mobile

```
DevTools: F12 → Ctrl+Shift+M → Select iPhone SE (375px)

[ ] Feature works on mobile width
[ ] No horizontal scrolling
[ ] Data displays correctly
[ ] Touch interactions work
[ ] Text is readable
```

### Step 5d: Test Edge Cases

```
EDGE CASES:
[ ] Empty data - what happens?
[ ] Missing field - handled gracefully?
[ ] Invalid data - error state shows?
[ ] Old data - still displays correctly?
[ ] Multiple scenarios - bug fixed in all?
```

---

## Phase 6: CODE REVIEW (5 min)

### Step 6a: Run Code Review

```bash
/code-review
```

### Step 6b: Address Findings

Typical findings for bug fixes:
- "This should also handle case X" → Add if reasonable
- "Simplify this logic" → Improve if it helps clarity
- "Add comments explaining the fix" → Document the fix

### Step 6c: Re-test After Changes

```bash
npm run dev
# ... test bug fix again ...
```

---

## Phase 7: VERIFICATION (3 min)

### Step 7a: Final Checklist

```
BUG FIX VERIFICATION:
[ ] Bug is reproducible (initially)
[ ] Fix is applied and minimal
[ ] Bug is no longer reproducible
[ ] Edge cases tested
[ ] No regressions found
[ ] All screen sizes tested
[ ] No console errors
[ ] Code review passed
[ ] Commit message clear
```

### Step 7b: Document the Fix

Update CLAUDE.md if this is a known issue:
```markdown
### Known Issues
- Bug: Description
  - Status: FIXED (commit hash)
  - Root cause: Explanation
```

---

## Phase 8: MERGE (3 min)

### Step 8a: Final Test

```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Switch back to fix
git checkout fix/bug-name

# Rebase (or merge, your choice)
git rebase main

# Test one more time
npm run dev
```

### Step 8b: Merge to Main

```bash
# Switch to main
git checkout main

# Merge fix
git merge --no-ff fix/bug-name

# Delete branch
git branch -d fix/bug-name

# Push
git push origin main
```

---

## Bug Fix Best Practices

✅ **DO:**
- Isolate the fix to root cause only
- Test immediately after fix
- Document why bug happened
- Test all related features
- Keep bug fix commits separate

❌ **DON'T:**
- Fix other issues while fixing bug
- Refactor while fixing
- Skip edge case testing
- Merge without testing
- Delete/comment out code (remove it completely)

---

## Common Bug Categories

### 1. Missing Data Field

**Symptom:** Shows 0 or undefined
**Solution:** 
- Check API response has field
- Use fallback: `data.field || defaultValue`
- Add null check if needed

### 2. Wrong Calculation

**Symptom:** Numbers don't add up
**Solution:**
- Verify formula is correct
- Check data types (string vs number)
- Add unit tests if critical

### 3. Typo in Field Name

**Symptom:** Data doesn't load
**Solution:**
- Search API response for correct name
- Check bootstrap data schema
- Verify web_name (not first_name + second_name)

### 4. Logic Error in Conditional

**Symptom:** Wrong state showing
**Solution:**
- Trace through logic with real data
- Add console.log to debug
- Verify all conditions

### 5. Race Condition/Timing

**Symptom:** Works sometimes, fails sometimes
**Solution:**
- Add proper loading states
- Wait for promises to resolve
- Check component lifecycle hooks

---

## Troubleshooting

### Problem: Can't Reproduce Bug

**Solution:**
1. Get exact steps from user
2. Try on real device/screen size
3. Clear browser cache (DevTools → Application → Clear site data)
4. Check if bug is in specific browser
5. Ask user for screenshot

### Problem: Fix Breaks Something Else

**Solution:**
1. Understand the dependency
2. Find alternative fix that doesn't break it
3. If fix is critical, fix both issues
4. Run full regression test

### Problem: Can't Find Root Cause

**Solution:**
1. Add console.log in suspected area
2. Use DevTools debugger (F12)
3. Step through code line by line
4. Check network tab for API responses
5. Trace data flow from input to output

---

## Success Criteria

Bug fix is complete when:

✅ Bug is reproducible initially
✅ Root cause is understood
✅ Fix is minimal and isolated
✅ Bug no longer reproducible
✅ No regressions found
✅ All screen sizes tested
✅ Edge cases handled
✅ Code review passed
✅ Code merged to main
✅ Verified working in production

---

## Quick Reference

```bash
# Create fix branch
git checkout -b fix/description

# Test locally
npm run dev

# Commit fix
git commit -m "Fix: Description"

# Code review
/code-review

# Merge to main
git checkout main
git merge fix/description
```

