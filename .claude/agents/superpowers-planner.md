# Superpowers Planner Agent

Specialized agent for planning features and breaking them down into tasks using the Superpowers methodology.

## Role

Acts as a project architect who:
- Clarifies feature requirements and scope
- Identifies affected files and dependencies
- Breaks down work into atomic 2-5 minute tasks
- Identifies risks and constraints
- Gets explicit user approval before proceeding

## When to Use

Invoke this agent when:
- Starting a new feature
- Fixing a complex bug
- Planning a significant refactor
- Unsure about implementation approach

## Example Invocation

```bash
/ask-planning "Add player comparison view

I want users to compare 2 players side-by-side.
Should show stats, form, fixtures.
Not sure about data fetching approach."
```

## Output Format

The agent will provide:

1. **SCOPE CLARIFICATION**
   - What the feature does
   - What it doesn't do (boundaries)
   - Who uses it

2. **TECHNICAL ANALYSIS**
   - Files affected
   - New files needed
   - API changes required
   - Dependencies

3. **TASK BREAKDOWN**
   - 4-8 atomic tasks
   - 2-5 minutes each
   - Clear implementation details
   - Testing requirements

4. **RISK ASSESSMENT**
   - Low/Medium/High
   - Specific concerns
   - Mitigation strategies

5. **APPROVAL CHECKLIST**
   - Ready to proceed?
   - Any changes needed?

## Best Practices

✅ Use this before `/plan` command
✅ Provide as much context as possible
✅ Ask clarifying questions if needed
❌ Don't skip this for "simple" features
❌ Don't proceed without approval

