# Todo Plan Examples

## Example 1: DRY Violations

```markdown
# Code Review Plan

## Overview
Extract duplicated validation and API call logic into shared utilities.

## Tasks

### Priority 1: Extract Duplicate Logic
- [ ] Create `utils/validation.py` with shared email/phone validation from `user.py:45` and `admin.py:32`
- [ ] Create `utils/api_client.py` base class for duplicate HTTP logic in `services/`

### Priority 2: Config Extraction
- [ ] Move hardcoded API URLs from `services/payment.py` to `config/endpoints.py`
- [ ] Extract retry counts and timeouts to `config/settings.py`

---

## Review Summary
_To be completed after all tasks are done_

### Changes Made
- 

### Notes
- 
```

## Example 2: Component Cleanup

```markdown
# Code Review Plan

## Overview
Split oversized components and improve code organization.

## Tasks

### Priority 1: Single Responsibility
- [ ] Extract PDF generation from `OrderService` into `services/pdf_generator.py`
- [ ] Move email sending from `UserController` to `services/email_service.py`

### Priority 2: Reuse Existing Code
- [ ] Replace custom date parsing in `reports.py` with existing `utils/dates.py` functions
- [ ] Use `BaseRepository` for `ProductRepository` instead of raw SQL

### Priority 3: Minor Cleanup
- [ ] Remove unused imports in `models/` directory
- [ ] Add missing type hints to public functions in `api/`

---

## Review Summary
_To be completed after all tasks are done_

### Changes Made
- 

### Notes
- 
```

## Task Sizing Guide

| Size | Example | Impact |
|------|---------|--------|
| ✅ Good | "Extract `validate_email()` to utils" | 2-3 files, 10-20 lines |
| ✅ Good | "Move config value to settings.py" | 2 files, 5 lines |
| ❌ Too Big | "Refactor all services" | Unknown scope |
| ❌ Too Vague | "Improve code quality" | Not actionable |
