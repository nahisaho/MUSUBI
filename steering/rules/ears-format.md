# EARS Format Guidelines

## Overview
EARS (Easy Approach to Requirements Syntax) is a standardized format for writing testable, verifiable acceptance criteria in requirements documentation. It ensures clarity, consistency, and testability across all requirements.

## Why EARS?

Traditional requirements often suffer from:
- ❌ Ambiguous language ("should", "might", "as appropriate")
- ❌ Untestable statements ("user-friendly", "fast", "reliable")
- ❌ Missing context (when does this apply?)
- ❌ Multiple behaviors in one requirement

EARS solves these problems by providing structured patterns that force clarity.

## The 5 EARS Patterns

### 1. Event-Driven Requirements (Ubiquitous)
**Pattern**: `WHEN [event], the [system] SHALL [response/action]`

**Use Case**: Responses to specific events or triggers

**Examples**:
```
✅ WHEN user clicks the "Submit" button, the Order System SHALL validate all form fields
✅ WHEN payment is received, the Notification Service SHALL send a confirmation email
✅ WHEN API rate limit is exceeded, the Gateway SHALL return HTTP 429 status

❌ Bad: "The system should validate forms" (missing event trigger)
❌ Bad: "When user submits, validation happens" (not SHALL, unclear actor)
```

**Key Points**:
- Always start with WHEN
- Identify the triggering event clearly
- Use SHALL for mandatory behavior
- Name the system/service explicitly

### 2. State-Driven Requirements (Conditional)
**Pattern**: `WHILE [precondition/state], the [system] SHALL [response/action]`

**Use Case**: Behavior dependent on system state or preconditions

**Examples**:
```
✅ WHILE payment is processing, the Checkout UI SHALL display a loading indicator
✅ WHILE user is logged out, the Dashboard SHALL redirect to login page
✅ WHILE inventory is below minimum threshold, the System SHALL prevent new orders

❌ Bad: "Show loading when processing" (use WHILE for ongoing states)
❌ Bad: "The system blocks orders when inventory is low" (not SHALL)
```

**Key Points**:
- Use WHILE for ongoing states/conditions
- Describes behavior during a state
- State must be observable/testable

### 3. Unwanted Behavior Requirements (Error Handling)
**Pattern**: `IF [trigger/error condition], THEN the [system] SHALL [response/action]`

**Use Case**: System response to errors, failures, or undesired situations

**Examples**:
```
✅ IF invalid credit card number is entered, THEN the Payment Form SHALL display "Invalid card number" error
✅ IF database connection fails, THEN the API SHALL return HTTP 503 with retry-after header
✅ IF user enters incorrect password 3 times, THEN the Auth System SHALL lock the account for 30 minutes

❌ Bad: "Handle errors gracefully" (not specific enough)
❌ Bad: "If error, show message" (what error? what message?)
```

**Key Points**:
- Use IF...THEN for error scenarios
- Be specific about error conditions
- Define exact error responses

### 4. Optional Feature Requirements
**Pattern**: `WHERE [feature is included/enabled], the [system] SHALL [response/action]`

**Use Case**: Requirements for optional, conditional, or configurable features

**Examples**:
```
✅ WHERE dark mode is enabled, the UI SHALL use dark color scheme
✅ WHERE premium subscription is active, the App SHALL enable advanced analytics
✅ WHERE A/B test variant B is assigned, the Homepage SHALL display alternate hero image

❌ Bad: "If premium, show analytics" (use WHERE for configuration/features)
❌ Bad: "Premium users can see analytics" (not SHALL, unclear behavior)
```

**Key Points**:
- Use WHERE for feature flags/configurations
- Different from IF (errors) and WHILE (states)
- Describes optional capabilities

### 5. Ubiquitous Requirements (Always Active)
**Pattern**: `The [system] SHALL [response/action]`

**Use Case**: Always-active requirements and fundamental system properties

**Examples**:
```
✅ The User Service SHALL encrypt passwords using bcrypt with cost factor 12
✅ The API SHALL respond within 200ms for 95th percentile requests
✅ The Mobile App SHALL support iOS 14 and above

❌ Bad: "Passwords should be encrypted" (use SHALL, not "should")
❌ Bad: "The app is fast" (not measurable)
```

**Key Points**:
- No condition prefix (always active)
- Used for fundamental properties
- Still must be testable

## Combined Patterns

You can combine patterns for complex requirements:

```
✅ WHILE user is authenticated, WHEN logout button is clicked, the Auth Service SHALL invalidate session token
✅ WHERE two-factor authentication is enabled, IF incorrect OTP is entered 3 times, THEN the System SHALL lock account
✅ WHEN file upload completes AND file size exceeds 10MB, the Storage Service SHALL compress the file
```

## Subject Selection Guidelines

Choose the appropriate subject (system/service) for clarity:

### Software Projects
Use concrete system/service/component names:
- ✅ "the User Auth Module"
- ✅ "the Payment Service"
- ✅ "the Dashboard UI"
- ❌ "the system" (too vague if multiple services)

### API Requirements
Use specific API or endpoint names:
- ✅ "the POST /api/users endpoint"
- ✅ "the GraphQL resolver"
- ✅ "the REST API"

### UI Requirements
Use screen/component names:
- ✅ "the Login Form"
- ✅ "the Product List Component"
- ✅ "the Mobile Navigation"

## Quality Criteria

Every EARS requirement must be:

1. **Testable**: Can you write a test to verify it?
   - ✅ "SHALL return HTTP 200" (testable)
   - ❌ "SHALL be user-friendly" (not testable)

2. **Verifiable**: Can you objectively confirm it works?
   - ✅ "SHALL respond within 200ms" (measurable)
   - ❌ "SHALL be fast" (subjective)

3. **Single Behavior**: One requirement = one behavior
   - ✅ Split into multiple requirements if needed
   - ❌ Don't cram multiple SHALLs into one requirement

4. **Objective Language**:
   - ✅ Use "SHALL" for mandatory behavior
   - ✅ Use "SHOULD" for recommendations (sparingly)
   - ❌ Avoid: "might", "could", "as appropriate", "user-friendly"

5. **Clear Conditions**: Context must be unambiguous
   - ✅ "WHEN user clicks Submit button"
   - ❌ "WHEN user wants to submit" (unclear event)

## Common Mistakes to Avoid

### ❌ Mistake 1: Vague Language
```
❌ Bad: "The system should handle errors appropriately"
✅ Good: "IF database query fails, THEN the API SHALL return HTTP 500 with error details"
```

### ❌ Mistake 2: Multiple Behaviors in One Requirement
```
❌ Bad: "WHEN user submits form, the System SHALL validate fields, save data, and send email"
✅ Good: Split into 3 requirements:
  1. WHEN user submits form, the System SHALL validate all required fields
  2. WHEN validation passes, the System SHALL save data to database
  3. WHEN data is saved, the System SHALL send confirmation email
```

### ❌ Mistake 3: Untestable Requirements
```
❌ Bad: "The UI SHALL be intuitive and easy to use"
✅ Good: "WHEN new user completes onboarding, the System SHALL guide them to first task within 3 clicks"
```

### ❌ Mistake 4: Missing Trigger/Condition
```
❌ Bad: "The System SHALL display error message"
✅ Good: "IF login credentials are invalid, THEN the Login Form SHALL display 'Invalid username or password' error"
```

### ❌ Mistake 5: Using Wrong Pattern
```
❌ Bad: "IF dark mode is enabled, the UI shows dark colors" (use WHERE for features)
✅ Good: "WHERE dark mode is enabled, the UI SHALL use dark color scheme"
```

## EARS Template for Requirements Document

```markdown
## Requirement 1: [Feature Name]

**Objective**: As a [role], I want [capability], so that [benefit]

### Acceptance Criteria

1. WHEN [event], the [System] SHALL [response]
2. WHILE [state], the [System] SHALL [response]
3. IF [error condition], THEN the [System] SHALL [error response]
4. WHERE [feature enabled], the [System] SHALL [response]
5. The [System] SHALL [always-active behavior]
```

## Examples by Domain

### E-commerce
```
1. WHEN user adds item to cart, the Cart Service SHALL update cart total
2. WHILE payment is processing, the Checkout UI SHALL disable all form inputs
3. IF payment fails, THEN the System SHALL display specific error message and allow retry
4. WHERE guest checkout is enabled, the System SHALL allow purchase without account
5. The Product API SHALL return results within 100ms for 95th percentile
```

### SaaS Application
```
1. WHEN user upgrades to premium, the Subscription Service SHALL activate premium features immediately
2. WHILE trial period is active, the Dashboard SHALL display days remaining banner
3. IF usage exceeds quota, THEN the System SHALL send warning email at 80% and 100%
4. WHERE SSO is configured, the Login SHALL redirect to identity provider
5. The Application SHALL maintain 99.9% uptime over any 30-day period
```

### Mobile App
```
1. WHEN app launches, the System SHALL display splash screen for maximum 2 seconds
2. WHILE network is unavailable, the App SHALL display offline mode indicator
3. IF API request times out, THEN the App SHALL retry up to 3 times with exponential backoff
4. WHERE push notifications are enabled, the App SHALL display notification badge
5. The App SHALL support devices running iOS 14.0 or later
```

## Integration with Testing

EARS requirements map directly to test cases:

```
Requirement:
WHEN user submits valid login form, the Auth Service SHALL return JWT token

Test Case:
Test: test_login_with_valid_credentials
Given: Valid username "user@example.com" and password "Password123!"
When: POST /api/auth/login with credentials
Then: Response status is 200 AND response body contains JWT token
```

## Tips for Writing Good EARS Requirements

1. **Start with the trigger**: What causes this behavior?
2. **Name the actor**: Which system/service/component?
3. **Use SHALL**: Make it mandatory
4. **Be specific**: Exact values, messages, behaviors
5. **One behavior per requirement**: Split if needed
6. **Make it testable**: Could you automate a test?
7. **Review and refine**: Can a developer implement this unambiguously?

## Checklist

Before finalizing a requirement, verify:

- [ ] Uses one of the 5 EARS patterns correctly
- [ ] Trigger/condition is clearly defined
- [ ] System/service is explicitly named
- [ ] Uses "SHALL" (not "should", "might", "will")
- [ ] Describes single, specific behavior
- [ ] Is testable and verifiable
- [ ] Has no ambiguous language
- [ ] Could be implemented without clarification questions

---

**Remember**: Good requirements save time in development and testing. EARS format ensures your requirements are clear, testable, and implementable from day one.

**Last Updated**: [To be auto-generated by Steering Agent or manually maintained]
