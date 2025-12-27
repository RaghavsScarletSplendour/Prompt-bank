---
name: technical-requirements-generator
description: Transform codebase context into a structured review plan with actionable todo items. Use when receiving output from the codebase-context skill and needing to produce a todo.md file for code review and improvements. Triggers on requests like "review this code", "create a review plan", "what needs to be fixed", or when preparing a structured improvement plan.
---

# Technical Requirements Generator

Transform codebase context into a structured review plan (todo.md) with simple, actionable tasks.

## Input

Codebase context from the codebase-context skill containing:
- Project overview and tech stack
- Architecture and key components
- Q&A context (user's goals, pain points, issues mentioned)

## Output

A `tasks/todo.md` file with:
- Prioritized list of review items
- Simple, minimal-impact tasks
- Checkboxes for tracking progress
- Review summary section (to be filled after completion)

## Workflow

1. **Parse context** - Extract issues, goals, and improvement opportunities
2. **Identify improvements** - Apply code organization principles
3. **Create todo plan** - Write tasks/todo.md
4. **Await approval** - User verifies plan before work begins

## Step 1: Parse Context

From codebase context, identify:
- Pain points mentioned in Q&A
- Code quality issues observed
- Missing patterns or inconsistencies
- Tech debt or duplication
- User's specific goals/requests

## Step 2: Identify Improvements

Apply these code organization principles to find actionable items:

| Principle | What to Look For |
|-----------|------------------|
| **DRY** | Duplicated logic that should be extracted into reusable functions/utilities/base classes |
| **Single Responsibility** | Components doing too much, should be split |
| **Config Extraction** | Hardcoded values that should be in config files |
| **Base Classes** | Shared functionality that could use inheritance/composition |
| **Existing Code Reuse** | New code that duplicates existing functionality |

**Critical constraint**: Every task must be **simple and minimal-impact**. Avoid massive or complex changes. Each change should touch as little code as possible.

## Step 3: Create Todo Plan

Generate `tasks/todo.md` using this structure:

```markdown
# Code Review Plan

## Overview
[1-2 sentences: what this review addresses]

## Tasks

### Priority 1: [Category]
- [ ] [Simple, specific task]
- [ ] [Simple, specific task]

### Priority 2: [Category]
- [ ] [Simple, specific task]
- [ ] [Simple, specific task]

### Priority 3: [Category]
- [ ] [Simple, specific task]

---

## Review Summary
_To be completed after all tasks are done_

### Changes Made
- 

### Notes
- 
```

## Task Writing Guidelines

Good tasks are:
- **Specific**: "Extract duplicate validation logic from `user.py` and `admin.py` into `utils/validation.py`"
- **Small**: Each task = one focused change
- **Independent**: Can be completed and verified alone
- **Testable**: Clear when it's done

Bad tasks:
- "Refactor the codebase" (too vague)
- "Improve performance" (not specific)
- "Fix all the issues" (not actionable)

## Step 4: Await Approval

After generating the plan, prompt user to verify before any work begins:

```
I've created the review plan in tasks/todo.md. Please review and let me know if you'd like any changes before I begin working through the items.
```

## Execution Guidelines (for downstream skill)

When tasks are being executed:
1. Work through tasks in order, checking them off
2. Provide high-level explanation of each change made
3. Keep changes simple - minimize code impact
4. After completion, fill in the Review Summary section
