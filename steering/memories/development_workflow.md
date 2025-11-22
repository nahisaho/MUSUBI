# Development Workflow

Effective development processes and procedures for the MUSUBI project.

---

## Testing Workflow

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Organization

- Unit tests: `tests/*.test.js`
- Test coverage target: >80%
- Run tests before every commit
- Fix failing tests immediately

### Test Guidelines

✅ **Best Practices:**
- Write tests for new features
- Update tests when changing behavior
- Keep tests focused and independent
- Use descriptive test names
- Mock external dependencies

---

## Code Quality Workflow

### Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

**Lint rules:**
- ESLint configuration in project root
- Follow JavaScript Standard Style
- No warnings allowed in CI

### Formatting

```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format
```

**Format standards:**
- Prettier for consistent formatting
- 2-space indentation
- Single quotes for strings
- Trailing commas where valid

### Pre-commit Checklist

Before committing:
1. ✅ Run `npm run lint:fix`
2. ✅ Run `npm run format`
3. ✅ Run `npm test`
4. ✅ Verify all pass
5. ✅ Review changes
6. ✅ Write clear commit message

---

## Build and Release Workflow

### Version Management

```bash
# Bump version
npm version patch  # 0.1.6 -> 0.1.7 (bug fixes)
npm version minor  # 0.1.7 -> 0.2.0 (new features)
npm version major  # 0.2.0 -> 1.0.0 (breaking changes)
```

**Versioning guidelines:**
- Patch: Bug fixes, documentation updates
- Minor: New features, non-breaking changes
- Major: Breaking changes, major refactoring

### Publishing to npm

```bash
# 1. Ensure all tests pass
npm test

# 2. Bump version
npm version [patch|minor|major]

# 3. Commit and push
git push origin main --tags

# 4. Publish to npm
npm publish
```

**Publishing checklist:**
1. ✅ All tests passing
2. ✅ Documentation updated
3. ✅ CHANGELOG.md updated
4. ✅ Version bumped appropriately
5. ✅ Committed and pushed
6. ✅ npm publish successful

---

## Git Workflow

### Branch Strategy

- **main**: Production-ready code
- Feature branches for development (if needed)
- Direct commits to main for small projects

### Commit Messages

**Format:**
```
type: Brief description

Detailed explanation if needed.
- List of changes
- Additional context
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: Add large file splitting pattern to prevent context overflow

Applied multi-part generation to 23/25 agents.
- Level 1: File-by-file output
- Level 2: Split files >300 lines
```

```
chore: Bump version to 0.1.7

New features:
- Large file splitting pattern
- Complete context overflow prevention
```

### Push and Sync

```bash
# Add all changes
git add -A

# Commit with message
git commit -m "type: message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## Documentation Workflow

### Creating Documentation

1. **Plan structure**: Outline sections and content
2. **Write English version**: Create `filename.md`
3. **Write Japanese version**: Create `filename.ja.md`
4. **Review both versions**: Check accuracy and consistency
5. **Commit both files together**

### Updating Documentation

1. Update English version first
2. Update Japanese version to match
3. Verify both are synchronized
4. Commit both together

### Documentation Guidelines

✅ **Best Practices:**
- Clear, concise language
- Code examples where helpful
- Links to related documentation
- Keep both languages synchronized
- Update when code changes

---

## Agent Development Workflow

### Creating New Agent

1. **Design**: Define agent purpose and responsibilities
2. **Create SKILL.md**: Document agent capabilities
3. **Add to registry**: Update `src/agents/registry.js`
4. **Test**: Verify agent functions correctly
5. **Document**: Add to README and steering docs

### Modifying Existing Agent

1. **Read current implementation**: Understand existing pattern
2. **Plan changes**: What needs to be modified
3. **Update SKILL.md**: Modify agent documentation
4. **Test changes**: Verify still works correctly
5. **Document changes**: Update related docs

### Agent Quality Checklist

✅ **Required elements:**
- Clear role description
- Trigger terms defined
- Allowed tools specified
- Phase-by-phase workflow
- Interactive dialogue flow
- Output format examples
- Bilingual support (if document-generating)
- Constitutional compliance references

---

## Maintenance Workflow

### Regular Tasks

**Weekly:**
- Review open issues
- Update dependencies (if needed)
- Check for security updates

**Monthly:**
- Review and update documentation
- Clean up stale branches
- Update CHANGELOG.md

**Per Release:**
- Update version number
- Update CHANGELOG.md
- Run full test suite
- Publish to npm
- Create GitHub release
- Update documentation

### Monitoring

**What to monitor:**
- npm download statistics
- GitHub issues and discussions
- User feedback
- Error reports

**Response process:**
1. Acknowledge issue/feedback
2. Investigate and reproduce
3. Create fix or enhancement
4. Test thoroughly
5. Release update
6. Notify users

---

## Collaboration Workflow

### Working with Multiple Agents

1. **Orchestrator agent**: Coordinates multiple agents
2. **Sequential execution**: One agent at a time
3. **Context sharing**: Via steering documents
4. **Memory system**: Share knowledge across agents

### Agent Communication

- Agents read steering documents for context
- Agents write to steering/memories for persistence
- Clear handoff between agents
- Document decisions in memories

---

## Troubleshooting Workflow

### Common Issues

**Tests failing:**
1. Run `npm test` to see failures
2. Check recent changes
3. Review test output
4. Fix issues
5. Rerun tests

**Lint errors:**
1. Run `npm run lint:fix`
2. Review remaining errors
3. Fix manually if needed
4. Verify with `npm run lint`

**Publishing issues:**
1. Check npm authentication
2. Verify package.json correct
3. Ensure version not already published
4. Check network connection
5. Try again

---

## Template for New Workflows

```markdown
## Workflow Name

### Purpose
What this workflow accomplishes

### Steps
1. Step one
2. Step two
3. Step three

### Commands
```bash
# Example commands
command --option
```

### Checklist
✅ Item 1
✅ Item 2

### Troubleshooting
Common issues and solutions
```

---

**Note**: This file documents development workflows. For architectural decisions, see `architecture_decisions.md`. For lessons learned, see `lessons_learned.md`.
