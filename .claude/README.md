# .claude Directory - Superpowers Configuration

This directory contains Claude-specific configuration for the FPL Analysis project using the Superpowers methodology.

---

## 📁 Directory Structure

```
.claude/
├── settings.json           # Superpowers-specific settings
├── settings.local.json     # Local permission allowlist
├── README.md               # This file
├── agents/                 # Specialized agents
│   ├── superpowers-planner.md    # Plan features
│   └── superpowers-reviewer.md   # Review code quality
├── workflows/              # Step-by-step workflows
│   ├── new-feature.md      # Feature development
│   └── bug-fix.md          # Bug fix process
└── templates/              # Templates for common tasks
    └── feature-plan.md     # Feature plan template
```

---

## 🚀 Quick Start

### Starting a New Feature

1. **Plan the feature:**
   ```bash
   /plan "Feature description..."
   ```

2. **Follow the workflow:**
   - See: `.claude/workflows/new-feature.md`
   - Estimated time: 30-120 minutes

3. **Use task tracking:**
   ```bash
   TodoWrite  # Create and track tasks
   ```

4. **Review before merge:**
   ```bash
   /code-review
   ```

### Fixing a Bug

1. **Diagnose the bug:**
   ```bash
   /plan "Fix: Bug description..."
   ```

2. **Follow the workflow:**
   - See: `.claude/workflows/bug-fix.md`
   - Estimated time: 15-45 minutes

3. **Test thoroughly:**
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (375px)

---

## 📋 Configuration Files

### `settings.json`

Superpowers methodology configuration:
- Branch naming conventions
- Commit message format
- Code style rules
- Allowed/prohibited git commands
- Automation triggers

**When to modify:** When project conventions change

### `settings.local.json`

Local permissions allowlist:
- Approved PowerShell commands
- Approved git operations
- External API access

**When to modify:** Add new allowed commands as needed

---

## 👥 Specialized Agents

### Superpowers Planner
**Location:** `agents/superpowers-planner.md`

Use when:
- Starting a new feature
- Uncertain about approach
- Need to break down complex work

Provides:
- Scope clarification
- File analysis
- Task breakdown
- Risk assessment
- Approval checklist

### Superpowers Reviewer
**Location:** `agents/superpowers-reviewer.md`

Use when:
- Before merging to main
- Want quality verification
- Uncertain if code is ready

Reviews:
- Correctness (does it work?)
- Pattern compliance (follows conventions?)
- Testing verification (tested on 3 sizes?)
- Code quality (clean, DRY, documented?)
- Documentation (CLAUDE.md updated?)

---

## 📖 Workflows

### New Feature Workflow
**Location:** `workflows/new-feature.md`

Complete guide for implementing a feature:
- Phase 1: DESIGN (planning)
- Phase 2: ISOLATED DEVELOPMENT (branching)
- Phase 3: IMPLEMENTATION (coding)
- Phase 4: TESTING (manual testing)
- Phase 5: CODE REVIEW (quality check)
- Phase 6: FINAL VERIFICATION (checklist)
- Phase 7: MERGE (integration)

**Estimated time:** 30-120 minutes

### Bug Fix Workflow
**Location:** `workflows/bug-fix.md`

Complete guide for fixing bugs:
- Phase 1: DIAGNOSIS (understand the bug)
- Phase 2: ISOLATED DEVELOPMENT (branch)
- Phase 3: DIAGNOSIS VERIFICATION (reproduce)
- Phase 4: IMPLEMENTATION (fix)
- Phase 5: TESTING (verify fix)
- Phase 6: CODE REVIEW (quality)
- Phase 7: VERIFICATION (checklist)
- Phase 8: MERGE (integrate)

**Estimated time:** 15-45 minutes

---

## 🎯 Templates

### Feature Plan Template
**Location:** `templates/feature-plan.md`

Use when running `/plan` command:
- Defines scope clearly
- Identifies affected files
- Documents dependencies
- Assesses risks
- Estimates complexity

**Examples:** Simple, Medium, and High complexity features

---

## 🔄 Superpowers Workflow Overview

The complete development cycle:

```
┌─────────────────────────────────────────────────────────┐
│ 1. DESIGN (/plan)                                       │
│    - Clarify requirements                               │
│    - Identify affected files                            │
│    - Break down tasks                                   │
│    - Get approval before proceeding                     │
└──────────────────┬──────────────────────────────────────┘
                   │ User approves
┌──────────────────▼──────────────────────────────────────┐
│ 2. ISOLATED DEVELOPMENT (git checkout -b feature/...)   │
│    - Create feature branch                              │
│    - Setup task tracking (TodoWrite)                    │
│    - Work in isolation                                  │
└──────────────────┬──────────────────────────────────────┘
                   │ Branch created
┌──────────────────▼──────────────────────────────────────┐
│ 3. TASK BREAKDOWN (TodoWrite)                           │
│    - List 2-5 minute tasks                              │
│    - Clear implementation details                       │
│    - Testing requirements                               │
└──────────────────┬──────────────────────────────────────┘
                   │ Tasks defined
┌──────────────────▼──────────────────────────────────────┐
│ 4. IMPLEMENTATION (npm run dev)                         │
│    - RED: Write test/spec                               │
│    - GREEN: Make it work                                │
│    - REFACTOR: Make it clean                            │
│    - Immediate testing in browser                       │
└──────────────────┬──────────────────────────────────────┘
                   │ Features coded
┌──────────────────▼──────────────────────────────────────┐
│ 5. MANUAL TESTING (3 screen sizes)                      │
│    - Desktop (1920px)                                   │
│    - Tablet (768px)                                     │
│    - Mobile (375px)                                     │
│    - Edge cases & regression testing                    │
└──────────────────┬──────────────────────────────────────┘
                   │ All tests pass
┌──────────────────▼──────────────────────────────────────┐
│ 6. CODE REVIEW (/code-review)                           │
│    - Verify correctness                                 │
│    - Check pattern compliance                           │
│    - Verify testing completed                           │
│    - Address findings                                   │
└──────────────────┬──────────────────────────────────────┘
                   │ Review passed
┌──────────────────▼──────────────────────────────────────┐
│ 7. MERGE (git merge feature/...)                        │
│    - Final verification                                 │
│    - Commit with clear message                          │
│    - Cleanup branches                                   │
│    - Push to main                                       │
└──────────────────┬──────────────────────────────────────┘
                   │ Merged!
┌──────────────────▼──────────────────────────────────────┐
│ ✅ FEATURE LIVE                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Key Commands Reference

### Planning & Design
```bash
/plan "Feature description"    # Plan feature (get approval)
TodoWrite                      # Create task list
```

### Development
```bash
git checkout -b feature/name   # Create branch
npm run dev                    # Start dev server
git add .                      # Stage changes
git commit -m "message"        # Commit
```

### Quality Assurance
```bash
/code-review                   # Review code quality
npm run build                  # Check build (if available)
```

### Integration
```bash
git checkout main              # Switch to main
git merge feature/name         # Merge feature
git branch -d feature/name     # Delete branch
git push origin main           # Push to remote
```

---

## 📚 Related Documentation

- **CLAUDE.md** - Complete project guide (architecture, conventions, etc.)
- **SUPERPOWERS.md** - Detailed Superpowers methodology
- **WORKFLOW_EXAMPLES.md** - Real examples of common tasks
- **CHECKLIST.md** - Pre-merge quality checklist
- **README.md** (root) - Project setup and overview

---

## ✅ Project Conventions

### Naming
- Branches: `feature/description` or `fix/description`
- Components: PascalCase (`TeamSquad.tsx`)
- Functions: camelCase (`getPlayerStats()`)
- Constants: UPPER_SNAKE_CASE (`MAX_TEAMS`)

### Code Style
- Player names: Always use `web_name` (never first_name + second_name)
- Styling: Tailwind CSS (no inline styles)
- Comments: Explain WHY, not WHAT
- Types: Always define TypeScript interfaces

### Testing
- Manual testing on desktop, tablet, mobile
- Test happy path AND edge cases
- Check for regressions in other features
- No console.log statements in production code

### Git
- Atomic commits (one logical change per commit)
- Clear commit messages with body
- Feature branches for isolation
- Code review before merge
- No force pushes to main

---

## 🎓 Learning Path

**New to Superpowers?**

1. Read `CLAUDE.md` (5 min)
2. Read `SUPERPOWERS.md` (10 min)
3. Read relevant workflow:
   - `workflows/new-feature.md` (for features)
   - `workflows/bug-fix.md` (for bugs)
4. See `WORKFLOW_EXAMPLES.md` (real examples)
5. Use `CHECKLIST.md` before merging

**Total time:** ~30 minutes to understand the methodology

---

## 🚨 Common Mistakes to Avoid

❌ **Skipping /plan** → Features go off-scope
✅ Skip the plan, understand scope first

❌ **Tasks too large** → Hard to verify completion
✅ Keep tasks to 2-5 minutes max

❌ **Skipping browser testing** → UI bugs missed
✅ Test on desktop, tablet, mobile

❌ **Merging without code review** → Quality issues
✅ Always run `/code-review` before merge

❌ **Not updating CLAUDE.md** → Docs become stale
✅ Update docs when architecture changes

---

## 💡 Tips for Success

1. **Start with `/plan`** - Clarifies scope and approach
2. **Use TodoWrite** - Track progress, maintain momentum
3. **Test in browser** - Catch UI issues early
4. **Commit frequently** - Smaller commits are easier to review
5. **Code review always** - Catch issues before merge
6. **Update docs** - Future self will thank you
7. **Keep it simple** - Follow conventions, don't over-engineer

---

## 🤝 Support

If you have questions:
- Check relevant workflow file
- See WORKFLOW_EXAMPLES.md
- Review CHECKLIST.md
- Ask the planner agent: `/ask-planning "..."`
- Ask the reviewer agent: `/code-review`

Happy developing! 🚀

