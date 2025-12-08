# Examples

Real-world examples of using MUSUBI in projects.

## Quick Examples

### Initialize a New Project

```bash
# Initialize with Claude Code
musubi-init --platform claude-code

# Initialize with multiple platforms
musubi-init --platform all

# Initialize in current directory
musubi-init --name my-project --platform copilot
```

### Create Requirements

```bash
# Generate requirements for a feature
musubi-requirements auth-feature

# Validate existing requirements
musubi-requirements validate
```

**Generated Output**:

```markdown
# Requirements: auth-feature

## REQ-AUTH-001: User Login
WHEN user submits valid credentials,
the Auth Service SHALL authenticate and create session

**Acceptance Criteria**:
- [ ] Valid credentials create session
- [ ] Invalid credentials return error
- [ ] Session token returned to client
```

### Create Design Documents

```bash
# Generate design from requirements
musubi-design auth-feature

# Generate with specific templates
musubi-design auth-feature --template c4-component
```

**Generated Output**:

```markdown
# Design: auth-feature

## C4 Component Diagram

```text
[User] --> [AuthController] --> [AuthService]
                                     |
                                     v
                              [TokenManager]
                                     |
                                     v
                                [Database]
```

## ADR-001: JWT for Session Management

**Status**: Accepted

**Context**: Need stateless authentication...

**Decision**: Use JWT tokens...
```

### Break Down Tasks

```bash
# Generate implementation tasks
musubi-tasks auth-feature
```

**Generated Output**:

```markdown
# Tasks: auth-feature

## Phase 1: Setup
- [ ] Create AuthService class
- [ ] Define interfaces

## Phase 2: Core Implementation  
- [ ] Implement login method
- [ ] Implement token generation
- [ ] Add password hashing

## Phase 3: Testing
- [ ] Unit tests for AuthService
- [ ] Integration tests
```

### Validate Against Constitution

```bash
# Validate all articles
musubi-validate

# Validate specific article
musubi-validate article 4

# Validate specific feature
musubi-validate --feature auth-feature
```

---

## Full Workflow Example

### 1. Initialize Project

```bash
mkdir my-webapp && cd my-webapp
git init
musubi-init --name my-webapp --platform claude-code
```

### 2. Create Feature Requirements

```bash
musubi-requirements user-registration
```

Edit `storage/specs/user-registration/requirements.md`:

```markdown
# Requirements: User Registration

## REQ-REG-001: Email Validation
WHEN user enters email,
the Registration Service SHALL validate email format

## REQ-REG-002: Password Strength
WHEN user enters password,
the Registration Service SHALL verify minimum strength requirements

## REQ-REG-003: Duplicate Check
WHEN user submits registration,
IF email already exists,
THEN the System SHALL display "Email already registered" error
```

### 3. Generate Design

```bash
musubi-design user-registration
```

Review and update `storage/specs/user-registration/design.md`.

### 4. Create Tasks

```bash
musubi-tasks user-registration
```

### 5. Implement with Traceability

In your code:

```typescript
/**
 * Validates email format
 * @requirement REQ-REG-001
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### 6. Validate Compliance

```bash
# Check traceability
musubi-trace

# Validate constitution
musubi-validate

# Check for gaps
musubi-gaps
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: MUSUBI Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm install -g musubi-sdd
      
      - name: Validate Constitution
        run: musubi-validate
        
      - name: Check Traceability
        run: musubi-trace verify
        
      - name: Detect Gaps
        run: musubi-gaps --fail-on-gaps
```

---

## Project Structure Example

After full initialization:

```
my-project/
├── steering/
│   ├── product.md           # Product context
│   ├── structure.md         # Architecture patterns
│   ├── tech.md              # Technology stack
│   └── rules/
│       ├── constitution.md  # 9 Constitutional Articles
│       └── workflow.md      # 8-stage workflow
├── storage/
│   ├── features/            # Feature specifications
│   │   └── user-auth/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── changes/             # Change history
├── CLAUDE.md                # Claude Code config
└── package.json
```

---

## More Examples

- [Authentication System](/examples/auth-system)
- [REST API Design](/examples/rest-api)
- [Microservices](/examples/microservices)
- [Frontend App](/examples/frontend)
