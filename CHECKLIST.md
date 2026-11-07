# Pre-Merge Checklist

Use this checklist before merging any feature to main. Print it or copy-paste it into your task list.

---

## 📋 Before Starting

- [ ] Read CLAUDE.md for project architecture
- [ ] Read SUPERPOWERS.md for methodology
- [ ] Run `/plan` to clarify requirements
- [ ] Get explicit user approval on approach
- [ ] Create feature branch: `git checkout -b feature/...`

---

## 💻 During Development

### Code Quality

- [ ] Component has TypeScript types defined
- [ ] No unused imports
- [ ] No `console.log()` statements left
- [ ] No hardcoded values (use constants/env vars)
- [ ] Comments explain WHY, not WHAT
- [ ] Follows project naming conventions:
  - [ ] Player names use `web_name` (never first_name + second_name)
  - [ ] Component names are PascalCase
  - [ ] Functions are camelCase
  - [ ] Constants are UPPER_SNAKE_CASE

### Code Style

- [ ] Uses Tailwind CSS for styling (no inline styles)
- [ ] Responsive design implemented:
  - [ ] Mobile-first approach
  - [ ] Uses `sm:`, `md:`, `lg:` breakpoints
  - [ ] No hardcoded pixel widths
- [ ] Consistent with existing components
- [ ] No duplicate logic (extract to utilities if needed)

### Error Handling

- [ ] Error states are handled gracefully
- [ ] Loading states shown to users
- [ ] User-friendly error messages
- [ ] No console errors in browser

---

## 🧪 Testing - MANDATORY FOR UI

### Desktop Testing (1920px)

- [ ] Open browser at `http://localhost:3000`
- [ ] Navigate to feature
- [ ] Test all interactive elements
- [ ] Verify data displays correctly
- [ ] Check layout and spacing
- [ ] Verify colors and text visibility
- [ ] Test happy path (normal data)
- [ ] Test edge cases (empty data, errors)

### Tablet Testing (768px)

- [ ] Open DevTools (F12)
- [ ] Toggle device mode (Ctrl+Shift+M)
- [ ] Select "iPad" (768px width)
- [ ] Verify layout adapts correctly
- [ ] Verify text is readable
- [ ] Verify no horizontal scrolling
- [ ] Test all interactions on touch

### Mobile Testing (400px)

- [ ] Select "iPhone SE" (375px width)
- [ ] Verify layout stacks vertically
- [ ] Verify text is readable (not tiny)
- [ ] Verify buttons are touchable (min 44x44px)
- [ ] Verify no horizontal scrolling
- [ ] Test all interactions on touch

### Regression Testing

- [ ] Navigate to other features
- [ ] Verify no visual breakage
- [ ] Verify navigation still works
- [ ] Verify other components still render
- [ ] Check sidebar/menu still functions

### API Testing (if changed)

- [ ] Fetch works with valid data
- [ ] Error handling for failed requests
- [ ] Loading state shown during fetch
- [ ] Data is cached appropriately

---

## ✏️ Before Code Review

### Git Status

- [ ] Run `git status` and review changes
- [ ] Only relevant files staged
- [ ] No accidental changes (node_modules, .env, etc.)

### Commit Message

- [ ] Clear, descriptive title (under 72 chars)
- [ ] Body explains WHAT and WHY
- [ ] Bullet points for clarity
- [ ] No "WIP" or "temp" commits

Example:
```
Add PlayerStats component for detailed player view

- Display goals, assists, clean sheets, minutes
- Responsive design (mobile/tablet/desktop)
- Fetches from bootstrap API
- Tested on 3 screen sizes
```

### Documentation

- [ ] CLAUDE.md updated if architecture changed
- [ ] Code comments added for non-obvious logic
- [ ] No broken links in comments
- [ ] Type definitions are clear

---

## 🔍 Code Review

Run this before merging:

```bash
/code-review
```

Then:

- [ ] Address all findings
- [ ] Re-run code review if major changes
- [ ] Confirm no new TypeScript errors
- [ ] Confirm no new linting issues

---

## ✅ Final Verification

### Code Status

- [ ] No TypeScript errors: `npm run build` (if available)
- [ ] No console errors in browser DevTools
- [ ] No console.log statements remain
- [ ] All imports are used
- [ ] All variables are defined

### Feature Status

- [ ] All tasks marked complete in TodoWrite
- [ ] All manual testing completed
- [ ] All code review findings addressed
- [ ] Feature works as planned

### Git Status

```bash
# Should show only your changes
git status

# Should show your feature commits
git log main..HEAD

# Should not show uncommitted changes
git diff
```

---

## 🚀 Merge Checklist

Only proceed if all above items are checked!

```bash
# 1. Ensure main is up to date
git fetch origin
git checkout main
git pull origin main

# 2. Go back to feature branch
git checkout feature/your-feature

# 3. Merge (or rebase if team uses rebase)
git merge main

# 4. Resolve any conflicts (if any)
# ... edit conflicting files ...
# git add .
# git commit -m "Merge main"

# 5. Final verification
npm run dev  # Start dev server
# ... test one more time in browser ...

# 6. Switch to main
git checkout main

# 7. Merge feature into main
git merge --no-ff feature/your-feature

# 8. Delete feature branch
git branch -d feature/your-feature

# 9. Push to remote
git push origin main
```

### After Merge

- [ ] Verify feature still works on main
- [ ] Verify no regressions
- [ ] Delete feature branch locally: `git branch -d feature/your-feature`
- [ ] Close any related issues/PRs
- [ ] Celebrate! 🎉

---

## 🚫 STOP - Don't Merge If:

❌ Any of these are true:

- Code review not run or has unaddressed findings
- Manual testing not completed on 3 screen sizes
- console.log statements left in code
- TypeScript errors present
- Feature branch not created (changes on main)
- Merge conflicts not resolved
- Documentation not updated
- Breaking changes to existing components
- Tests written but not passing

**Fix these issues before proceeding.**

---

## 📱 Quick Mobile Testing

Can't test on actual device? Use DevTools:

1. Open DevTools (F12 or Right-click → Inspect)
2. Click device toggle (Ctrl+Shift+M)
3. Select device from dropdown
4. Test interaction
5. Change orientation (Ctrl+Shift+M again if in device mode)

Common screen sizes to test:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1920px (Full screen)

---

## 📚 Resources

- **CLAUDE.md** - Project architecture & conventions
- **SUPERPOWERS.md** - Detailed methodology
- **WORKFLOW_EXAMPLES.md** - Real examples to follow

---

## 🎓 Remember

> "Measure twice, cut once"

The time spent on this checklist saves debugging time later. Quality first!

