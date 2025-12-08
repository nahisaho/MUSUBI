# Supported AI Agents

MUSUBI supports 7 AI coding agents through platform-specific templates.

## Agent Overview

| Agent | Status | Template Location |
|-------|--------|-------------------|
| Claude Code | ✅ Full Support | `steering/templates/agents/claude-code/` |
| Cline | ✅ Supported | `steering/templates/agents/cline/` |
| GitHub Copilot | ✅ Supported | `steering/templates/agents/copilot/` |
| Cursor | ✅ Supported | `steering/templates/agents/cursor/` |
| OpenHands | ✅ Supported | `steering/templates/agents/openhands/` |
| Roo Code | ✅ Supported | `steering/templates/agents/roo-code/` |
| Windsurf | ✅ Supported | `steering/templates/agents/windsurf/` |

## Claude Code

**Primary supported agent** with 25 dedicated skills.

### Features
- Full MUSUBI workflow integration
- 25 specialized skills (12 spec-driven + 13 general)
- Constitutional governance support
- Phase -1 gates integration

### Configuration

```yaml
# CLAUDE.md generated automatically
## MUSUBI Configuration
- Constitution: steering/rules/constitution.md
- Workflow: steering/rules/workflow.md
- Skills: 25 active skills
```

### Skills by Category

See [Skills Reference](/skills/) for complete list.

---

## GitHub Copilot

Integration through `.github/copilot-instructions.md`.

### Features
- Workspace-aware instructions
- Custom slash commands via skills
- MCP integration ready

### Configuration

```markdown
# .github/copilot-instructions.md

## MUSUBI Integration
When working on this project, follow MUSUBI SDD workflow:
1. Requirements first (EARS format)
2. Design before code (C4/ADR)
3. Full traceability
```

---

## Cursor

Integration through `.cursor/rules/` directory.

### Features
- Rule-based behavior configuration
- Project-specific customization
- Composer integration

### Configuration

```
.cursor/rules/
├── musubi.md          # Core MUSUBI rules
├── requirements.md    # EARS format rules
├── design.md          # C4/ADR rules
└── testing.md         # Testing requirements
```

---

## Cline

Integration through `.clinerules` file.

### Features
- Simple rule file configuration
- Project memory integration
- Plan mode support

### Configuration

```markdown
# .clinerules

## MUSUBI SDD Workflow
1. Always check constitution before major changes
2. Requirements must use EARS syntax
3. Design documents required before implementation
```

---

## OpenHands

Integration through `openhands.yml` configuration.

### Features
- YAML-based configuration
- Agent instruction customization
- Workspace context support

### Configuration

```yaml
# openhands.yml
agent:
  instructions: |
    This project uses MUSUBI SDD methodology.
    Follow the 8-stage workflow for all features.
```

---

## Roo Code

Integration through `.roo/` directory.

### Features
- Mode-specific rules
- Memory bank integration
- Custom instruction support

### Configuration

```
.roo/
├── rules/
│   └── musubi.md
└── modes/
    ├── architect.md
    └── code.md
```

---

## Windsurf

Integration through `.windsurfrules` file.

### Features
- Single file configuration
- Cascade feature integration
- Project context support

### Configuration

```markdown
# .windsurfrules

## Project Configuration
Framework: MUSUBI SDD
Workflow: 8-stage specification-driven development
Constitution: steering/rules/constitution.md
```

---

## Multi-Agent Setup

Initialize for multiple agents:

```bash
# Initialize for all supported agents
musubi-init --platform all

# Initialize for specific agents
musubi-init --platform claude-code --platform copilot --platform cursor
```

## Converting Between Agents

```bash
# Convert from Cursor to Claude Code
musubi-convert cursor claude-code

# Sync rules across all agents
musubi-sync
```

## Best Practices

1. **Start with one agent** - Master one before adding others
2. **Keep rules synchronized** - Use `musubi-sync` after changes
3. **Test agent understanding** - Verify agent follows MUSUBI workflow
4. **Platform-specific features** - Leverage each agent's strengths
