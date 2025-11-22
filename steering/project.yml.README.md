# MUSUBI Project Configuration (project.yml)

## Overview

`steering/project.yml` is MUSUBI's central project configuration file. It defines project-wide settings, conventions, agent behavior, and development workflows in a machine-readable format.

## Purpose

- **Standardize project settings**: Single source of truth for project configuration
- **Enable agent customization**: Agents read this file to adapt their behavior
- **Document conventions**: Codify naming, structure, and workflow patterns
- **Support automation**: Machine-readable format for tooling and scripts
- **Facilitate onboarding**: New team members understand project quickly

## File Location

```
steering/
├── project.yml           # Main project configuration (this file)
├── structure.md          # Architecture patterns
├── tech.md               # Technology stack
├── product.md            # Business context
└── memories/             # Persistent knowledge
```

## Configuration Sections

### 1. Project Metadata

```yaml
project_name: "musubi-sdd"
description: "Ultimate Specification Driven Development Tool..."
version: "0.1.7"
platforms: [claude-code, github-copilot, cursor, ...]
```

**Purpose**: Basic project identification and supported platforms.

**When to update**:
- Version changes (sync with package.json)
- New platform support added
- Description changes

---

### 2. Languages and Frameworks

```yaml
languages: [javascript, markdown, yaml]

frameworks:
  - name: "Node.js"
    version: ">=18.0.0"
    purpose: "runtime"
  - name: "Jest"
    version: "^29.0.0"
    purpose: "testing"
```

**Purpose**: Documents technology stack and dependencies.

**When to update**:
- New language added to project
- Framework version updated (sync with package.json)
- New dependency introduced
- Old dependency removed

---

### 3. Project Structure Conventions

```yaml
conventions:
  architecture_pattern: "25 Specialized Agents + Constitutional Governance"
  
  directory_structure:
    agents: "src/templates/agents/{platform}/skills/{agent-name}/"
    templates: "src/templates/"
    steering: "steering/"
  
  naming:
    files: "kebab-case"
    variables: "camelCase"
    constants: "UPPER_SNAKE_CASE"
```

**Purpose**: Defines code organization, naming conventions, file patterns.

**When to update**:
- Architecture changes
- New directory structure introduced
- Naming conventions change
- File patterns updated

---

### 4. Steering Configuration

```yaml
steering:
  auto_update:
    enabled: false
    frequency: "on-demand"
  
  excluded_paths:
    - "node_modules/**"
    - "References/**"
  
  memories:
    enabled: true
    path: "steering/memories/"
    max_file_size_kb: 500
```

**Purpose**: Controls steering agent behavior and memory system.

**When to update**:
- Enable/disable auto-update
- Add exclusion patterns
- Change memory retention policy
- Adjust file size limits

---

### 5. Agent Configuration

```yaml
agents:
  default_language: "ja"
  bilingual_output:
    enabled: true
    languages: ["en", "ja"]
  
  output:
    gradual_generation: true
    large_file_splitting: true
    split_threshold_lines: 300
  
  dialogue:
    one_question_at_a_time: true
```

**Purpose**: Defines how all agents should behave.

**When to update**:
- Change default language
- Adjust output thresholds
- Enable/disable features
- Modify dialogue patterns

---

### 6. Development Workflow

```yaml
workflow:
  testing:
    required: true
    coverage_threshold: 80
  
  quality_gates:
    - name: "lint"
      command: "npm run lint"
      required: true
  
  commit:
    format: "type: brief description"
    types: [feat, fix, docs, ...]
```

**Purpose**: Documents development processes and quality standards.

**When to update**:
- Coverage threshold changes
- New quality gate added
- Commit format changes
- Publishing workflow updated

---

### 7. Custom Rules (Constitutional Articles)

```yaml
custom_rules:
  - rule: "All development shall begin with EARS specifications"
    enforcement: "requirements-analyst validates"
  
  - rule: "All artifacts comply with Constitutional Articles"
    enforcement: "constitution-enforcer validates"
```

**Purpose**: Defines project governance rules and enforcement.

**When to update**:
- New Constitutional Article added
- Enforcement mechanism changes
- Rule clarification needed

---

### 8. Context Overflow Prevention

```yaml
context_overflow_prevention:
  level_1:
    enabled: true
    strategy: "file-by-file"
  
  level_2:
    enabled: true
    strategy: "multi-part"
    threshold_lines: 300
```

**Purpose**: Configures multi-level context overflow protection.

**When to update**:
- Threshold adjustments needed
- New level added
- Strategy changes

---

### 9. SDD Configuration

```yaml
sdd:
  stages:
    - name: "steering"
      agent: "steering"
      trigger: "#sdd-steering"
      description: "Establish project memory"
  
  ears:
    patterns:
      - ubiquitous: "The <system> shall <action>"
      - event_driven: "WHEN <trigger> the <system> shall <action>"
```

**Purpose**: Defines SDD process stages and EARS validation patterns.

**When to update**:
- New SDD stage added
- Agent assignment changes
- EARS patterns updated
- Trigger terms modified

---

### 10. Integration Settings

```yaml
integrations:
  git:
    default_branch: "main"
    push_after_commit: true
  
  npm:
    package_name: "musubi-sdd"
    publish_on_version_bump: false
```

**Purpose**: External tool integration configuration.

**When to update**:
- Git workflow changes
- npm publishing settings change
- New integration added

---

### 11. Maintenance and Monitoring

```yaml
maintenance:
  tasks:
    - frequency: "weekly"
      description: "Review steering documents"
  
  memory_cleanup:
    enabled: true
    archive_after_days: 365
```

**Purpose**: Defines maintenance schedules and cleanup policies.

**When to update**:
- Maintenance frequency changes
- Cleanup policy updates
- New task added

---

### 12. Experimental Features

```yaml
experimental:
  auto_sync_steering:
    enabled: false
  
  ai_code_review:
    enabled: false
```

**Purpose**: Flags for features under development or testing.

**When to update**:
- Enable feature for testing
- Graduate feature to stable (move to main config)
- Disable failed experiment

---

## How Agents Use project.yml

### Steering Agent

Reads configuration to:
- Determine update frequency
- Apply exclusion patterns
- Manage memory system
- Configure auto-sync behavior

### All Document-Generating Agents

Read configuration to:
- Check bilingual output requirement
- Apply gradual generation settings
- Use correct file splitting threshold
- Follow naming conventions

### Constitution Enforcer

Reads configuration to:
- Validate custom rules compliance
- Check quality gates
- Verify naming conventions
- Enforce workflow requirements

### Requirements Analyst

Reads configuration to:
- Validate EARS format patterns
- Check SDD stage configuration
- Enforce specification-first rule

---

## Maintenance Guidelines

### Version Synchronization

**CRITICAL**: Keep `version` in sync with `package.json`

```bash
# After bumping version in package.json
# Update steering/project.yml:
version: "0.1.7"  # Match package.json
```

### Framework Updates

When updating dependencies:

```yaml
# Before: package.json shows Jest ^30.0.0
frameworks:
  - name: "Jest"
    version: "^30.0.0"  # Update to match
    purpose: "testing"
```

### Adding New Agents

When creating new agent:

```yaml
# Add to SDD stages if applicable
sdd:
  stages:
    - name: "new-stage"
      agent: "new-agent-name"
      trigger: "#sdd-new-stage"
      description: "What this stage does"
```

### Changing Conventions

When updating coding standards:

```yaml
# Document the change
conventions:
  naming:
    files: "snake_case"  # Changed from kebab-case
```

**Also update**:
- Existing files to match new convention
- Agent SKILL.md files
- Documentation examples

---

## Validation

### Manual Validation

Check configuration validity:

```bash
# Verify YAML syntax
npm install -g js-yaml
js-yaml steering/project.yml

# Check for required fields
grep "project_name:" steering/project.yml
grep "version:" steering/project.yml
```

### Automated Validation (Future)

```bash
# Planned: musubi validate-config
musubi validate-config
```

Expected checks:
- YAML syntax valid
- Required fields present
- Version matches package.json
- Frameworks match dependencies
- Paths exist

---

## Best Practices

### 1. Keep in Sync

**Always synchronize**:
- `version` ↔ `package.json`
- `frameworks` ↔ `package.json` dependencies
- `custom_rules` ↔ `steering/rules/constitution.md`
- `sdd.stages` ↔ agent SKILL.md files

### 2. Document Changes

When modifying project.yml:
- Update this README if structure changes
- Document rationale in commit message
- Update related documentation
- Notify team of breaking changes

### 3. Validate Before Commit

```bash
# Check YAML syntax
js-yaml steering/project.yml

# Run tests
npm test

# Lint config changes
npm run lint
```

### 4. Use Comments Wisely

```yaml
# Good: Explains WHY, not WHAT
auto_update: false  # Manual until we have confidence in auto-sync

# Poor: Restates the obvious
project_name: "musubi-sdd"  # The project name
```

### 5. Version Control

- Commit project.yml with related changes
- Don't commit experimental settings to main
- Tag releases when config changes significantly

---

## Future Enhancements

### Phase 2 (Current)
- ✅ Create project.yml schema
- ✅ Document all configuration sections
- ⏳ Integrate with steering agent
- ⏳ Add validation tool

### Phase 3
- Auto-detect frameworks from package.json
- Validate config on CI/CD
- Generate config from project scan
- Support multiple environments (dev, prod)

### Phase 4
- Hot-reload config changes
- Config versioning and migration
- Config presets for common setups
- Visual config editor

---

## Examples

### Reading Configuration in Agent

```javascript
// Example: Agent reads bilingual setting
const config = readYAML('steering/project.yml');
const bilingualEnabled = config.agents.bilingual_output.enabled;

if (bilingualEnabled) {
  generateEnglishVersion();
  generateJapaneseVersion();
}
```

### Checking Threshold

```javascript
// Example: Check file splitting threshold
const threshold = config.agents.output.split_threshold_lines;

if (fileLineCount > threshold) {
  splitIntoMultipleParts(fileContent, threshold);
}
```

### Validating EARS Format

```javascript
// Example: Validate requirement against EARS patterns
const earsPatterns = config.sdd.ears.patterns;
const isValidEARS = validateRequirement(requirement, earsPatterns);
```

---

## Troubleshooting

### Configuration Not Loading

**Problem**: Agents don't seem to read project.yml

**Solutions**:
1. Check file exists: `ls -la steering/project.yml`
2. Verify YAML syntax: `js-yaml steering/project.yml`
3. Check file permissions: `chmod 644 steering/project.yml`
4. Restart AI coding assistant

### Version Mismatch

**Problem**: project.yml version doesn't match package.json

**Solutions**:
```bash
# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Update project.yml
sed -i "s/^version:.*/version: \"$VERSION\"/" steering/project.yml
```

### Invalid YAML Syntax

**Problem**: YAML parser errors

**Solutions**:
1. Check indentation (use spaces, not tabs)
2. Quote strings with special characters
3. Validate online: https://www.yamllint.com/
4. Use `js-yaml` CLI for detailed errors

---

## Related Documentation

- **steering/structure.md**: Architecture patterns (human-readable)
- **steering/tech.md**: Technology stack (human-readable)
- **steering/product.md**: Business context (human-readable)
- **steering/memories/**: Historical knowledge
- **steering/rules/constitution.md**: 9 Constitutional Articles

**Relationship**:
- project.yml = Machine-readable configuration
- steering/*.md = Human-readable documentation
- memories/ = Historical context and lessons
- rules/ = Governance principles

---

## Contributing

When modifying project.yml:

1. **Read this README first**
2. **Check what sections are affected**
3. **Update synchronization targets** (package.json, etc.)
4. **Validate YAML syntax**
5. **Test with affected agents**
6. **Update this README if structure changes**
7. **Commit with clear message**
8. **Document in architecture_decisions.md** if significant

---

## Support

For questions about project.yml:
- Check this README
- Read steering/memories/domain_knowledge.md
- Review SERENA-STEERING-COMPARISON.md
- Ask steering agent: `#sdd-steering` → "Review" mode

---

**Last Updated**: 2025-11-22  
**Version**: 0.2.0 (Phase 2: Project Configuration)  
**Status**: Active, In Use
