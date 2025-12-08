# EARS Requirements Format

EARS (Easy Approach to Requirements Syntax) provides 5 patterns for writing unambiguous requirements.

## Why EARS?

Traditional requirements often use ambiguous language:

❌ "The system should be fast"
❌ "Users may log in"
❌ "The application could save data"

EARS enforces clarity:

✅ "WHEN user clicks Save, the System SHALL store data within 500ms"

## The 5 EARS Patterns

### 1. Ubiquitous (Always Active)

For requirements that are always true.

**Syntax**: `The [System] SHALL [action]`

**Examples**:
```
The System SHALL encrypt all user data using AES-256
The API SHALL return responses in JSON format
The Database SHALL maintain referential integrity
```

**Use when**: The requirement applies at all times, regardless of state or events.

---

### 2. Event-Driven

For requirements triggered by specific events.

**Syntax**: `WHEN [event], the [System] SHALL [response]`

**Examples**:
```
WHEN user clicks "Submit", the Form Service SHALL validate all required fields
WHEN session expires, the Auth Service SHALL redirect user to login page
WHEN error occurs, the Logger SHALL record error with stack trace
```

**Use when**: Something happens that triggers a specific response.

---

### 3. State-Driven

For requirements active during specific states.

**Syntax**: `WHILE [state], the [System] SHALL [behavior]`

**Examples**:
```
WHILE data is loading, the UI SHALL display a loading spinner
WHILE user is logged in, the System SHALL refresh token every 15 minutes
WHILE in maintenance mode, the API SHALL return 503 status
```

**Use when**: A condition persists and the system must behave accordingly.

---

### 4. Unwanted Behavior (Error Handling)

For requirements about handling errors and edge cases.

**Syntax**: `IF [condition], THEN the [System] SHALL [response]`

**Examples**:
```
IF validation fails, THEN the Form Service SHALL display error messages
IF database connection fails, THEN the System SHALL retry 3 times
IF rate limit exceeded, THEN the API SHALL return 429 status
```

**Use when**: Handling error conditions, edge cases, or exceptional situations.

---

### 5. Optional Feature

For requirements dependent on configuration or feature flags.

**Syntax**: `WHERE [feature enabled], the [System] SHALL [capability]`

**Examples**:
```
WHERE MFA is enabled, the Auth Service SHALL require second factor
WHERE dark mode is active, the UI SHALL use dark color scheme
WHERE premium tier, the API SHALL allow 1000 requests per minute
```

**Use when**: Behavior depends on a feature flag or configuration setting.

---

## Combining Patterns

You can combine patterns for complex requirements:

```
WHILE user is logged in,
  WHEN session approaches expiry,
    IF token refresh fails,
      THEN the System SHALL redirect to login page
```

## Keywords to Avoid

| Avoid | Use Instead |
|-------|-------------|
| should | SHALL |
| may | SHALL (or remove if optional) |
| might | SHALL with IF condition |
| could | SHALL |
| probably | (remove - be specific) |
| quickly | within X milliseconds |
| easy | (define specific UX criteria) |

## Validation

```bash
# Validate requirements format
musubi-requirements validate

# Check specific file
musubi-requirements validate --file docs/requirements/auth.md

# Validate Article IV compliance
musubi-validate article 4
```

## Templates

See [Requirements Template](/reference/templates/requirements) for complete template.

## Best Practices

1. **One requirement per statement** - Don't combine multiple requirements
2. **Be specific** - Include numbers, times, sizes where applicable
3. **Be testable** - Each requirement must have clear pass/fail criteria
4. **Use unique IDs** - REQ-FEATURE-001, REQ-FEATURE-002
5. **Include acceptance criteria** - Define how to verify
