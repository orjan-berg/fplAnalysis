# Getting Started with Superpowers

Quick start guide to begin using the Superpowers methodology in this project.

---

## ⚡ 2-Minute Quick Start

### To Add a New Feature

```bash
# 1. Plan it
/plan "Feature name

- What it does
- Which files it affects
- Any dependencies"

# User approves? Continue...

# 2. Create branch
git checkout -b feature/descriptive-name

# 3. Create tasks
TodoWrite

# 4. Develop
npm run dev
# ... code and test in browser ...

# 5. Review
/code-review

# 6. Merge
git checkout main
git merge feature/descriptive-name
```

---

## 🔍 To Fix a Bug

```bash
# 1. Plan the fix
/plan "Fix: Bug description

- What's broken
- Root cause
- How to fix it"

# User approves? Continue...

# 2. Create branch
git checkout -b fix/bug-name

# 3. Implement fix
npm run dev
# ... fix and test ...

# 4. Code review
/code-review

# 5. Merge
git checkout main
git merge fix/bug-name
```

---

## 📚 Full Guides

**For detailed walkthroughs, see:**

- `workflows/new-feature.md` - Feature development (7 phases)
- `workflows/bug-fix.md` - Bug fixing (8 phases)
- `WORKFLOW_EXAMPLES.md` - Real examples to follow (root directory)
- `CHECKLIST.md` - Pre-merge verification (root directory)

---

## 🎯 The Superpowers Cycle

```
PLAN (/plan)
    ↓
CREATE BRANCH (git checkout -b feature/...)
    ↓
BREAK DOWN TASKS (TodoWrite)
    ↓
IMPLEMENT (npm run dev + test in browser)
    ↓
CODE REVIEW (/code-review)
    ↓
MERGE (git merge feature/...)
    ↓
DONE! 🎉
```

---

## 🚨 Never Skip These

1. ✅ **Run `/plan` first**
   - Clarifies scope
   - Gets user approval
   - Prevents scope creep

2. ✅ **Test on 3 screen sizes**
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)
   - Use DevTools: F12 → Ctrl+Shift+M

3. ✅ **Run `/code-review` before merge**
   - Catches bugs
   - Checks conventions
   - Verifies testing

---

## 💻 Key Commands

```bash
# Planning
/plan "Feature description"

# Task tracking
TodoWrite

# Development
npm run dev                           # Start dev server
git checkout -b feature/name          # Create branch
git status                           # Check changes
git add .                            # Stage files
git commit -m "message"              # Commit
git push origin feature/name         # Push

# Quality
/code-review                         # Review code
npm run build                        # Check build

# Merging
git checkout main                    # Switch to main
git pull origin main                 # Update main
git merge feature/name               # Merge feature
git push origin main                 # Push to remote
```

---

## 🎓 Core Concepts

### Isolation (Branches)

Always use branches - never code on main:
```bash
# RIGHT
git checkout -b feature/new-component

# WRONG
# (just edit on main without branch)
```

### Atomic Tasks

Break work into small, completable tasks:
```
GOOD TASK (2-5 min):
[ ] Create component file with TypeScript types

BAD TASK (too large):
[ ] Implement entire player stats feature with API
```

### Manual Testing

All UI changes must be tested in browser:
```
DO:
1. npm run dev
2. Test in browser at http://localhost:3000
3. Test on mobile (DevTools: F12 → Ctrl+Shift+M)

DON'T:
- Skip testing
- Assume "it works" without browser test
- Only test on desktop
```

### Code Review

Quality gate before merge:
```bash
# Before merge, always run:
/code-review

# Address any findings
# Then merge
```

---

## 🔥 Quick Tips

1. **Small branches** → Easier to review, faster to merge
2. **Clear commits** → Easy to understand changes
3. **Test early** → Catch bugs immediately
4. **Ask questions** → Use `/plan` to clarify
5. **Update docs** → Keep CLAUDE.md in sync

---

## ❓ FAQ

**Q: Do I really need to test on mobile?**
A: Yes! Use DevTools (F12) to test at 375px width. It's fast.

**Q: Can I skip code review?**
A: No! `/code-review` catches ~70% of bugs before production.

**Q: Why use branches?**
A: Isolation = easy to revert, easy to work on multiple features.

**Q: How long should a task take?**
A: 2-5 minutes. If longer, break it into smaller tasks.

**Q: What if the plan changes?**
A: Update the plan and get user approval again. Scope creep kills projects!

---

## 🚀 Your First Feature

Ready to try? Here's your first feature:

1. Ask me: **"Plan a feature to add..."`**
2. I'll run `/plan` with a template
3. You approve (or ask for changes)
4. Follow `.claude/workflows/new-feature.md`
5. Build it step-by-step
6. Test on 3 screen sizes
7. Code review with `/code-review`
8. Merge when ready
9. Celebrate! 🎉

---

## 📞 Need Help?

- **Planning feature?** → Use `/plan` command
- **Reviewing code?** → Use `/code-review` command  
- **Need workflow steps?** → See `.claude/workflows/`
- **Need examples?** → See `WORKFLOW_EXAMPLES.md` (root)
- **Need checklist?** → See `CHECKLIST.md` (root)

---

## 🎯 Remember

> "Measure twice, cut once"

Quality up-front saves debugging later. The Superpowers methodology is designed to:
- ✅ Prevent bugs (planning + testing)
- ✅ Catch bugs (code review)
- ✅ Fix bugs fast (isolation)
- ✅ Keep docs updated (discipline)

Follow it and you'll ship quality code consistently. 🚀

---

**Ready to get started? Ask me to plan your next feature!**

