---
name: codebase-context
description: Gather comprehensive context from a codebase through systematic exploration and targeted questions. Use when the user provides a codebase and needs thorough understanding extracted for documentation purposes. Triggers on requests like "analyze this codebase", "understand this project", "gather context from this code", or when preparing input for technical documentation.
---

# Codebase Context Gatherer

Explore the codebase thoroughly, then ask the user targeted questions about what the code alone can't tell you.

## Output Format

After gathering all context and user answers, compile into this structure:

```markdown
# Codebase Context

## Project Overview
[What it is, what it does]

## Tech Stack
[Language, framework, key dependencies]

## Architecture
[High-level structure, main components, data flow]

## Key Components
[Component names, purposes, key files]

## Entry Points
[Main, API, CLI, etc.]

## Configuration
[How it's configured, environment variables]

## External Dependencies
[Databases, APIs, services]

## Q&A Context
### Q: [Question]
A: [User's answer]

## Notes
[Uncertainties, assumptions]
```

This output will be passed to the technical documentation skill.
