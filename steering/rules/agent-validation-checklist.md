# Agent Validation Checklist

**Purpose**: Ensure all Musuhi agents meet quality standards and consistency requirements

**Version**: 1.0
**Last Updated**: [Auto-generated]

---

## Validation Criteria

All agents must meet these criteria:

### 1. Steering Context Reference

**Requirement**: All agents must reference steering context

**Check**:
- [ ] Has steering context section in Session Start Message or Dialogue Flow
- [ ] References `steering/structure.md`, `steering/tech.md`, `steering/product.md`
- [ ] Instructs agent to check if files exist before referencing

**Pattern**:
```markdown
**📋 Steering Context (Project Memory):**
このプロジェクトにsteeringファイルが存在する場合は、**必ず最初に参照**してください：
- `steering/structure.md` - アーキテクチャパターン、ディレクトリ構造、命名規則
- `steering/tech.md` - 技術スタック、フレームワーク、開発ツール
- `steering/product.md` - ビジネスコンテキスト、製品目的、ユーザー

これらのファイルはプロジェクト全体の「記憶」であり、一貫性のある開発に不可欠です。
ファイルが存在しない場合はスキップして通常通り進めてください。
```

---

### 2. Document Language Policy

**Requirement**: All agents that create documents must have bilingual policy

**Check**:
- [ ] Has "Documentation Language Policy" section
- [ ] Specifies English-first, then Japanese translation
- [ ] Has file naming convention (`.md` and `.ja.md`)
- [ ] Instructs to create both versions for EACH deliverable

**Pattern**:
```markdown
## Documentation Language Policy

**CRITICAL: 英語版と日本語版の両方を必ず作成**

### Document Creation
1. **Primary Language**: Create all documentation in **English** first
2. **Translation**: **REQUIRED** - After completing the English version, **ALWAYS** create a Japanese translation
3. **Both versions are MANDATORY** - Never skip the Japanese version
4. **File Naming Convention**:
   - English version: `filename.md`
   - Japanese version: `filename.ja.md`
```

---

### 3. Document Reference Policy

**Requirement**: Agents must reference English versions of documents

**Check**:
- [ ] Has "Document Reference" section
- [ ] Specifies to always reference `.md` files (not `.ja.md`)
- [ ] Provides examples of correct/incorrect references

**Pattern**:
```markdown
### Document Reference

**CRITICAL: 他のエージェントの成果物を参照する際の必須ルール**

1. **Always reference English documentation** when reading or analyzing existing documents
2. **他のエージェントが作成した成果物を読み込む場合は、必ず英語版（`.md`）を参照する**
3. When citing documentation in your deliverables, reference the English version

**参照例:**
```
✅ 正しい: requirements/srs/srs-project-v1.0.md
❌ 間違い: requirements/srs/srs-project-v1.0.ja.md
```
```

---

### 4. Related Agents Section

**Requirement**: Agents should list related agents for workflow continuity

**Check**:
- [ ] Has "Related Agents" section
- [ ] Lists appropriate agents for before/after this agent
- [ ] Provides context on when to use related agents

---

### 5. Interactive Dialogue Flow (if applicable)

**Requirement**: Agents with user interaction should follow 1-question-at-a-time pattern

**Check**:
- [ ] Has structured dialogue phases
- [ ] Each question is asked one at a time
- [ ] Includes `👤 ユーザー: [回答待ち]` after each question
- [ ] Prohibits asking multiple questions at once

---

### 6. File Output Guidelines

**Requirement**: Agents that create files must have output guidelines

**Check**:
- [ ] Specifies output directory structure
- [ ] Has file naming conventions
- [ ] Includes versioning/dating in filenames
- [ ] Lists all required output files

---

### 7. EARS Format Support (Requirements-related agents)

**Requirement**: Requirements Analyst, System Architect, Test Engineer must support EARS

**Check** (if applicable):
- [ ] References `steering/rules/ears-format.md`
- [ ] Templates use EARS patterns
- [ ] Explains how to use EARS format

---

### 8. Progress Reporting (if applicable)

**Requirement**: Agents creating multiple files should report progress

**Check**:
- [ ] Instructs to update progress after each file
- [ ] Prohibits batch file creation
- [ ] Asks user confirmation between files

---

### 9. Session Start Message

**Requirement**: All agents must have a clear session start message

**Check**:
- [ ] Has "Session Start Message" section
- [ ] Greets user and explains agent's purpose
- [ ] Lists key capabilities
- [ ] Provides clear starting instructions

---

### 10. Templates and Examples

**Requirement**: Agents should provide templates for their outputs

**Check**:
- [ ] Has template sections for documents they create
- [ ] Templates are comprehensive
- [ ] Examples are provided
- [ ] Templates follow best practices

---

## Agent-by-Agent Validation

### Orchestration Agents

#### 1. Orchestrator ✅
- [ ] Steering context reference
- [ ] Language selection prompt
- [ ] Task decomposition logic
- [ ] Agent selection strategy
- [ ] Result integration approach

#### 2. Steering Agent ✅
- [ ] Three modes: Bootstrap, Sync, Review
- [ ] Steering context reference
- [ ] File analysis capabilities
- [ ] Update logic

---

### Requirements & Planning

#### 3. Requirements Analyst ✅
- [ ] Steering context reference (including EARS)
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Interactive dialogue (1-question-at-a-time)
- [ ] EARS format in templates
- [ ] File output guidelines
- [ ] Progress reporting rules

#### 4. Project Manager ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

---

### Architecture & Design

#### 5. System Architect ✅
- [ ] Steering context reference (including EARS reference)
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Interactive dialogue
- [ ] File output guidelines
- [ ] Related agents listed

#### 6. API Designer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 7. Database Schema Designer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 8. UI/UX Designer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

---

### Development & Implementation

#### 9. Software Developer ✅
- [ ] Steering context reference
- [ ] Document language policy (for code comments/docs)
- [ ] Document reference policy
- [ ] Related agents listed

#### 10. Test Engineer ✅
- [ ] Steering context reference (including EARS reference)
- [ ] Document language policy
- [ ] Document reference policy
- [ ] EARS-to-test mapping guidance
- [ ] Related agents listed

---

### Quality & Review

#### 11. Code Reviewer ✅
- [ ] Steering context reference
- [ ] Document reference policy
- [ ] Related agents listed

#### 12. Bug Hunter ✅
- [ ] Steering context reference
- [ ] Document reference policy
- [ ] Related agents listed

#### 13. Quality Assurance ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

---

### Security & Performance

#### 14. Security Auditor ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 15. Performance Optimizer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

---

### Infrastructure & Operations

#### 16. DevOps Engineer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 17. Cloud Architect ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 18. Database Administrator ✅
- [ ] Steering context reference
- [ ] Document reference policy
- [ ] Related agents listed

---

### Documentation & Specialized

#### 19. Technical Writer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

#### 20. AI/ML Engineer ✅
- [ ] Steering context reference
- [ ] Document language policy
- [ ] Document reference policy
- [ ] Related agents listed

---

## Validation Script

```bash
# Quick validation script to check all agents
for agent in src/templates/agents/*.md; do
  echo "Checking $(basename $agent)..."

  # Check for steering context
  if ! grep -q "📋 Steering Context" "$agent"; then
    echo "  ❌ Missing Steering Context"
  else
    echo "  ✅ Has Steering Context"
  fi

  # Check for document language policy (if agent creates documents)
  if grep -q "Document" "$agent" && ! grep -q "Documentation Language Policy" "$agent"; then
    echo "  ⚠️  May need Document Language Policy"
  fi

  echo ""
done
```

---

## Remediation Guide

If an agent fails validation:

1. **Add Steering Context**:
   - Insert steering context block in Session Start Message or Phase 1 of dialogue
   - Use standard pattern from section 1 above

2. **Add Document Language Policy**:
   - Add section after Role Definition
   - Use standard pattern from section 2 above

3. **Add Document Reference Policy**:
   - Add subsection under Document Language Policy
   - Use standard pattern from section 3 above

4. **Add EARS Reference** (if applicable):
   - Add to steering context block
   - Reference `steering/rules/ears-format.md`
   - Explain EARS usage in agent's context

5. **Update Templates**:
   - Ensure templates use latest standards
   - Add EARS format where appropriate
   - Include bilingual file naming

---

## Sign-off

All 20 agents validated: [ ] Yes [ ] No

**Validated By**: [Name]
**Date**: [YYYY-MM-DD]

**Issues Found**: [Number]
**Issues Resolved**: [Number]

---

## Continuous Validation

**Frequency**: Every major version release

**Trigger Events**:
- New agent added
- Steering structure changed
- New best practice identified
- User feedback indicates inconsistency

**Responsibility**: Core maintainer team
