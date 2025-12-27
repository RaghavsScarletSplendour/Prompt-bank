---
name: code-review-checker
desc Execute review instructions from a technical requirements document against the actual codebase. Use when you have output from the technical-requirements-generator skill and need to verify the code before making changes. Triggers on requests like "review the code", "check for problems", "validate the codebase", or "flag issues".
---

# Code Review Checker

Execute the review instructions contained in a technical requirements document against the actual codebase. Flag all problems found. No changes are made.

## Input

Technical requirements document from the technical-requirements-generator skill containing:
- Review instructions and checks to perform
- File paths and components to examine
- Acceptance criteria to verify
- Codebase context and patterns

## Process

1. **Read the technical document** - Extract all review instructions
2. **Execute each instruction** - Check the actual code files referenced
3. **Flag problems** - Document everything that doesn't match expectations
4. **Compile issues list** - Format for the task execution skill

## Output Format

```markdown
# Code Review: [Project/Feature Name]

**Reviewed**: [Date]
**Source**: [Technical requirements doc]

---

## Summary

- **Total issues**: [count]
- **Critical**: [count]
- **Warning**: [count]  
- **Info**: [count]

---

## Issues

### ISSUE-001: [Title]
- **Severity**: Critical | Warning | Info
- **Location**: [file:line or component]
- **Problem**: [What's wrong]
- **Fix**: [What to do]

### ISSUE-002: [Title]
...

---

## Passed ✓

[List items that checked out fine]
```

## Severity

- **Critical**: Blocks implementation, must fix
- **Warning**: Will likely cause problems
- **Info**: Minor issues, nice to fix

## Guidelines

- Follow every instruction in the technical document
- Check every file path mentioned
- Be specific about locations
- Every issue needs a fix recommendation
- No changes - only flag problems
