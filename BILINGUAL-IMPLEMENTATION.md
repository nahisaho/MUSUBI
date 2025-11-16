# Bilingual Documentation Implementation

## Overview

Implemented comprehensive bilingual documentation support across all MUSUBI components as requested:

**すべてのエージェントが作成するドキュメントは英語と日本語の２つを作成。すべてのエージェントが作成するドキュメントは英語版を参照します。**

## Implementation Summary

### 1. Slash Commands Updated (6 commands)

All slash commands now generate both English (.md) and Japanese (.ja.md) versions:

**Files Modified**:
- `src/templates/commands/sdd-steering.md` - Steering context generation
- `src/templates/commands/sdd-requirements.md` - Requirements specification
- `src/templates/commands/sdd-design.md` - Technical design
- `src/templates/commands/sdd-tasks.md` - Task breakdown
- `src/templates/commands/sdd-implement.md` - Implementation execution
- `src/templates/commands/sdd-validate.md` - Constitutional validation

**Key Changes**:
- Added bilingual file generation instructions
- English version (.md) generated FIRST as reference
- Japanese version (.ja.md) generated SECOND as translation
- Technical terms (REQ-XXX-NNN, EARS keywords, API endpoints) remain in English in Japanese versions
- Both versions maintained in sync

### 2. Skills Updated (19 skills)

All skills with "Project Memory (Steering System)" sections now explicitly reference English versions:

**Skills Updated**:
1. orchestrator
2. requirements-analyst
3. system-architect
4. api-designer
5. database-schema-designer
6. ui-ux-designer
7. software-developer
8. test-engineer
9. code-reviewer
10. bug-hunter
11. quality-assurance
12. security-auditor
13. performance-optimizer
14. devops-engineer
15. cloud-architect
16. database-administrator
17. technical-writer
18. ai-ml-engineer
19. project-manager

**Key Changes**:
- Added explicit instruction: "IMPORTANT: Always read the ENGLISH versions (.md) - they are the reference/source documents."
- Updated steering file references: `steering/structure.md` (English)
- Added note: "Japanese versions (.ja.md) are translations only. Always use English versions (.md) for all work."

### 3. README.md Updated

Added comprehensive bilingual documentation section:

**New Section**: "Bilingual Documentation"

**Content**:
- Language Policy (English: Reference/Source, Japanese: Translation)
- Files Generated Bilingually (Steering + Specifications)
- Generation Order (English FIRST, Japanese SECOND)
- Technical Terms Policy (stay in English)
- Added to Features list

### 4. Steering Templates

Steering templates already included "Multi-Language Support" section with correct policy:
- Primary Language: English
- Documentation: English first (.md), then Japanese (.ja.md)
- All agents reference English versions

## Language Policy

### English Version (.md)
- **Role**: Reference/Source document
- **Purpose**: Used by all skills for implementation work
- **Content**: Full specification with all details
- **Technical Terms**: All technical identifiers, requirement IDs, EARS keywords, API endpoints

### Japanese Version (.ja.md)
- **Role**: Translation
- **Purpose**: For Japanese-speaking team members
- **Content**: Translation of English version
- **Technical Terms**: Kept in English with Japanese explanations

## Files Affected

### Slash Commands
- src/templates/commands/sdd-steering.md
- src/templates/commands/sdd-requirements.md
- src/templates/commands/sdd-design.md
- src/templates/commands/sdd-tasks.md
- src/templates/commands/sdd-implement.md
- src/templates/commands/sdd-validate.md

### Skills (19 files)
- src/templates/skills/orchestrator/SKILL.md
- src/templates/skills/requirements-analyst/SKILL.md
- src/templates/skills/system-architect/SKILL.md
- src/templates/skills/api-designer/SKILL.md
- src/templates/skills/database-schema-designer/SKILL.md
- src/templates/skills/ui-ux-designer/SKILL.md
- src/templates/skills/software-developer/SKILL.md
- src/templates/skills/test-engineer/SKILL.md
- src/templates/skills/code-reviewer/SKILL.md
- src/templates/skills/bug-hunter/SKILL.md
- src/templates/skills/quality-assurance/SKILL.md
- src/templates/skills/security-auditor/SKILL.md
- src/templates/skills/performance-optimizer/SKILL.md
- src/templates/skills/devops-engineer/SKILL.md
- src/templates/skills/cloud-architect/SKILL.md
- src/templates/skills/database-administrator/SKILL.md
- src/templates/skills/technical-writer/SKILL.md
- src/templates/skills/ai-ml-engineer/SKILL.md
- src/templates/skills/project-manager/SKILL.md

### Documentation
- README.md

## Bilingual File Examples

### Steering Context
```
steering/structure.md      (English - Reference)
steering/structure.ja.md   (Japanese - Translation)
steering/tech.md           (English - Reference)
steering/tech.ja.md        (Japanese - Translation)
steering/product.md        (English - Reference)
steering/product.ja.md     (Japanese - Translation)
```

### Specifications
```
storage/specs/auth-requirements.md      (English - Reference)
storage/specs/auth-requirements.ja.md   (Japanese - Translation)
storage/specs/auth-design.md            (English - Reference)
storage/specs/auth-design.ja.md         (Japanese - Translation)
storage/specs/auth-tasks.md             (English - Reference)
storage/specs/auth-tasks.ja.md          (Japanese - Translation)
```

## Generation Workflow

### 1. Steering Generation (/sdd-steering)
```
1. Analyze codebase
2. Generate steering/structure.md (English)
3. Generate steering/structure.ja.md (Japanese translation)
4. Generate steering/tech.md (English)
5. Generate steering/tech.ja.md (Japanese translation)
6. Generate steering/product.md (English)
7. Generate steering/product.ja.md (Japanese translation)
```

### 2. Requirements Generation (/sdd-requirements [feature])
```
1. Read steering/structure.md (English)
2. Read steering/tech.md (English)
3. Read steering/product.md (English)
4. Generate storage/specs/[feature]-requirements.md (English)
5. Generate storage/specs/[feature]-requirements.ja.md (Japanese translation)
```

### 3. Design Generation (/sdd-design [feature])
```
1. Read storage/specs/[feature]-requirements.md (English)
2. Read steering context (English versions)
3. Generate storage/specs/[feature]-design.md (English)
4. Generate storage/specs/[feature]-design.ja.md (Japanese translation)
```

### 4. Tasks Generation (/sdd-tasks [feature])
```
1. Read storage/specs/[feature]-design.md (English)
2. Read storage/specs/[feature]-requirements.md (English)
3. Generate storage/specs/[feature]-tasks.md (English)
4. Generate storage/specs/[feature]-tasks.ja.md (Japanese translation)
```

## Technical Term Handling

### Terms That Stay in English (in Japanese versions)

- **Requirement IDs**: REQ-AUTH-001, REQ-PAY-002
- **EARS Keywords**: WHEN, WHILE, IF, WHERE, SHALL
- **Task IDs**: TASK-001, TASK-002
- **API Endpoints**: POST /api/auth/login, GET /api/users/:id
- **Database Names**: users, sessions, auth_tokens
- **Code Identifiers**: AuthService, UserRepository, LoginRequest
- **Technical Acronyms**: API, REST, GraphQL, JWT, OWASP, SQL

### Terms That Get Translated

- Explanatory text
- Design rationale
- Acceptance criteria descriptions
- Task descriptions
- Documentation prose

## Testing

The bilingual documentation feature has been implemented across:
- ✅ 6 slash commands
- ✅ 19 skills
- ✅ Steering templates (already had policy)
- ✅ README documentation

## Next Steps

1. Test with actual Claude Code execution
2. Verify bilingual generation in real project
3. Collect feedback from Japanese-speaking users
4. Ensure translation quality

---

**Implementation Date**: 2025-11-17
**Status**: Complete
**Files Modified**: 26 files (6 commands + 19 skills + 1 README)
