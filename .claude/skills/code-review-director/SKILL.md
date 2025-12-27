---
name: code-review-director
description: Director skill that orchestrates a complete code review workflow by coordinating three sub-skills in sequence (codebase-context, technical-requirements-generator, code-review-checker). Use when the user wants a comprehensive code review with actionable improvements. Triggers on requests like "review my codebase", "do a full code review", "analyze and improve this code", "help me refactor this project", or "find issues in my code and fix them".
---

# Code Review Director

Orchestrate a complete code review by coordinating three skills in sequence, then execute approved changes.

## Pipeline Overview
```
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│ 1. Context      │
└─────────────────────┘     └──────────────────────────┘     └─────────────────────┘
                                                                       │
                                                                       ▼
                                                              ┌─────────────────────┐
                                                              │ 4. User Approval    │
                                                              │    + Execution      │
                                                              └─────────────────────┘
```

## Workflow

### Phase 1: Context Gathering
**Skill**: `codebase-context`

1. Explore the codebase systematically
2. Ask user targeted questions about goals, pain points, prioritiesents-generator`

1. Parse context from Phase 1
2. Identify improvements using code organization principles (DRY, Single Responsibility, etc.)
3. Create prioritized todo plan

**Output**: `tasks/todo.md` with prioritized, actionable tasks

**Checkpoint**: Present plan to user, explain the rationale.

---

### Phase 3: Code Review
**Skill**: `code-review-checker`

1. Execute review instructions from Phase 2
2. Check actual code against the plan
3. Flag all issues found with severity and fix recommendations

**Output**: Code review report with issues list

**Checkpoint**: Present findings to user.

---

### Phase 4: Approval & Execution

1. Present complete plan to user:
   - Summary of context gathered
   - Prioritized task list
   - Issues found with proposed fixes

2. **Ask for explicit approval**:
```
   Here's the complete review plan. Would you like me to proceed with these changes?
   - Reply "yes" or "proceed" to begin
   - Reply with specific items to modify the plan
   - Reply "no" to cancel
```

3. **On approval**: Execute tasks in priority order
   - Work through each task
   - Check off completed items in todo.md
   - Provide brief explanation of each change
   - Fill in Review Summary when complete

4. **On modification request**: Adjust plan and re-confirm

5. **On rejection**: Stop and ask for guidance

## State Management

Track progress through phases:

| Phase | Status | Output Location |
|-------|--------|-----------------|
| Context | pending/complete | (in conversation) |
| Requirements | pending/complete | `tasks/todo.md` |
| Review | pending/complete | (in conversation or file) |
| Execution | pending/approved/complete | codebase changes |

## Error Handling

- **Missing codebase**: Ask user to provide or specify path
- **Incomplete context**: Return to Phase 1, ask clarifying questions
- **Ambiguous requirements**: Ask user to prioritize or clarify
- **Blocked task**: Skip and note in summary, continue with others

## Communication Style

- Be concise at checkpoints
- Explain *why* for each recommendation
- Group related changes when presenting
- Highlight high-impact vs quick-win tasks
