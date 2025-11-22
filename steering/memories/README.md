# Project Memory System

## Overview

The memory system is a persistent knowledge store that enables agents to maintain and share project-specific information across conversations. This creates a "learning" mechanism where important decisions, patterns, and insights are preserved for future reference.

## Purpose

- **Knowledge Persistence**: Maintain important information between conversations
- **Agent Collaboration**: Share insights across different specialized agents
- **Decision Tracking**: Record architectural decisions and their rationale
- **Workflow Documentation**: Capture effective development processes
- **Continuous Learning**: Build a growing knowledge base about the project

## Memory Categories

### 1. Architecture Decisions (`architecture_decisions.md`)
Records significant architectural and design decisions made during development.

**What to record:**
- Design patterns adopted
- Technology choices and rationale
- System architecture changes
- Component structure decisions
- Interface design choices

**Example:**
```markdown
## [2025-11-22] Agent Output Pattern

**Decision**: Implement gradual file-by-file output with multi-part splitting for large files

**Context**: Agent outputs were causing context length overflow errors

**Solution**: Two-level defense
1. File-by-file generation with [1/N] progress
2. Multi-part generation for files >300 lines

**Impact**: Prevents all context overflow scenarios
```

### 2. Development Workflow (`development_workflow.md`)
Documents effective development processes and procedures.

**What to record:**
- Build and test procedures
- Deployment processes
- Code review practices
- Release workflows
- Quality assurance steps

**Example:**
```markdown
## Testing Workflow

1. Run unit tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Lint code: `npm run lint:fix`
4. Format code: `npm run format`
5. Verify all pass before commit
```

### 3. Domain Knowledge (`domain_knowledge.md`)
Captures business logic, domain concepts, and project-specific knowledge.

**What to record:**
- Business rules and constraints
- Domain terminology
- User workflows
- Feature requirements
- Integration points

**Example:**
```markdown
## EARS Format Requirements

MUSUBI uses EARS (Easy Approach to Requirements Syntax) for requirements:
- UBIQUITOUS: The system SHALL [requirement]
- EVENT-DRIVEN: WHEN [event], the system SHALL [response]
- STATE-DRIVEN: WHILE [state], the system SHALL [response]
- OPTIONAL: WHERE [feature], the system SHALL [capability]
- UNWANTED: IF [error], THEN the system SHALL [response]
```

### 4. Suggested Commands (`suggested_commands.md`)
Lists frequently used commands and their purposes.

**What to record:**
- Common development commands
- Build and deployment scripts
- Testing commands
- Utility scripts
- Troubleshooting commands

**Example:**
```markdown
## Common Commands

### Development
- `npm run dev` - Start development mode
- `npm run build` - Build for production

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Watch mode

### Publishing
- `npm version patch/minor/major` - Bump version
- `npm publish` - Publish to npm
```

### 5. Lessons Learned (`lessons_learned.md`)
Records insights gained from challenges, mistakes, and successes.

**What to record:**
- Problems encountered and solutions
- What worked well
- What didn't work
- Insights for future work
- Best practices discovered

**Example:**
```markdown
## Context Length Management

**Challenge**: Agents generating large outputs caused context overflow

**Attempted Solutions**:
1. ❌ Reduce output quality - Unacceptable
2. ✅ Gradual file-by-file output - Partial success
3. ✅ Multi-part large file splitting - Complete solution

**Lesson**: Need multi-level protection for different overflow scenarios

**Applied**: All 23/25 agents now have two-level defense
```

## How to Use

### For Agents

**Reading Memory:**
```markdown
1. List available memories
2. Read relevant memory file
3. Use information in current task
4. Reference memory in deliverables if needed
```

**Writing Memory:**
```markdown
1. Identify knowledge worth preserving
2. Choose appropriate memory category
3. Append to existing memory or create new section
4. Use clear formatting with dates/context
```

**Updating Memory:**
```markdown
1. Read current memory content
2. Identify section to update
3. Add new information or revise existing
4. Preserve historical context when important
```

### For Users

**Viewing Memories:**
```bash
# List all memories
ls steering/memories/

# Read specific memory
cat steering/memories/architecture_decisions.md
```

**Adding Custom Memories:**
Create new markdown files in this directory following the same format.

## Memory Guidelines

### Content Quality

✅ **DO:**
- Record significant decisions with rationale
- Include dates and context
- Use clear, concise language
- Organize with headers and sections
- Link to related documentation
- Update when information changes

❌ **DON'T:**
- Record trivial or temporary information
- Duplicate information across memories
- Use unclear abbreviations
- Store sensitive information
- Let memories become stale

### Organization

**Structure:**
```markdown
## [Date] Topic Title

**Context**: Why this is important

**Decision/Process/Knowledge**: What was decided/done/learned

**Rationale**: Why this approach was chosen

**Impact**: Effects on the project

**Related**: Links to code/docs/other memories
```

**Categorization:**
- Use appropriate category files
- Create new categories if needed
- Keep related information together
- Use consistent formatting

## Maintenance

### Regular Reviews
- Review memories during major milestones
- Archive outdated information
- Update changed processes
- Consolidate related entries

### Cleanup
- Remove duplicates
- Update stale information
- Archive historical decisions
- Maintain readability

## Integration with Steering

Memory system complements steering documents:

**Steering Documents** (steering/*.md):
- Current state of the project
- Active patterns and conventions
- Technology stack in use
- Product vision and goals

**Memory System** (steering/memories/):
- Historical decisions and rationale
- Learned lessons and insights
- Effective workflows discovered
- Domain knowledge accumulated

Together, they provide both **current state** and **historical context**.

## Best Practices

1. **Record Early**: Don't wait - capture decisions when made
2. **Be Specific**: Include enough detail for future reference
3. **Add Context**: Explain why, not just what
4. **Update Actively**: Keep memories current
5. **Review Regularly**: Ensure relevance and accuracy
6. **Cross-Reference**: Link related memories and documents
7. **Date Entries**: Always include timestamps
8. **Organize Logically**: Use clear sections and headers

## Future Enhancements

Planned improvements:
- Automated memory suggestions from code changes
- Memory search functionality
- Memory templates for common patterns
- Integration with CLI tools
- Memory analytics and insights
