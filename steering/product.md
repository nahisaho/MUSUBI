# Product Context

**Project**: MUSUBI (結び)
**Last Updated**: 2025-12-08
**Version**: 3.0.0

---

## Product Vision

**Vision Statement**: Unify AI-assisted software development through specification-driven methodology

> MUSUBI ("connection/binding" in Japanese) connects AI coding agents with structured development 
> practices, ensuring quality, traceability, and constitutional governance across the entire 
> software development lifecycle.

**Mission**: Provide a production-ready SDD framework that works across 7 AI coding platforms with 
25+ specialized agents, enabling teams to maintain high-quality standards while leveraging AI 
assistance.

---

## Product Overview

### What is MUSUBI?

MUSUBI is an **Ultimate Specification Driven Development (SDD) Tool** that synthesizes best 
practices from 6 leading frameworks into a unified system for multiple AI coding agents.

Key capabilities:
- **7 AI Platforms**: Claude Code, GitHub Copilot, Cursor, Gemini CLI, Codex CLI, Qwen Code, Windsurf
- **27 Specialized Skills/Agents**: Orchestrator, Requirements, Architecture, Development, Quality
- **9 Constitutional Articles**: Immutable governance rules for quality assurance
- **Complete Traceability**: Requirements → Design → Code → Tests

### Problem Statement

**Problem**: AI coding agents lack structured methodology

Current challenges:
- Fragmented AI tools with no unified workflow
- Ambiguous requirements leading to implementation errors
- Lost traceability between requirements and code
- Inconsistent quality across AI-generated code
- Difficulty managing brownfield projects

### Solution

**Solution**: Constitutional governance + Multi-agent architecture

MUSUBI provides:
1. **Unified Workflow**: One SDD methodology across 7 platforms
2. **EARS Format**: 5 patterns for unambiguous requirements
3. **100% Traceability**: Bidirectional Req↔Design↔Code↔Test mapping
4. **Constitutional Articles**: 9 immutable quality gates
5. **Delta Specs**: Change management for brownfield projects

---

## Target Users

### Primary Users

#### User Persona 1: AI-Assisted Developer

**Demographics**:
- **Role**: Software Developer using AI coding tools
- **Organization Size**: Individual to Enterprise
- **Technical Level**: Intermediate to Senior

**Goals**:
- Maintain code quality while using AI assistance
- Ensure traceability from requirements to implementation
- Work efficiently across multiple AI platforms

**Pain Points**:
- AI generates code without proper specifications
- Losing track of why code was written
- Inconsistent code quality from AI suggestions

**Use Cases**:
- Initialize SDD for new projects
- Generate EARS requirements before coding
- Validate constitutional compliance

---

#### User Persona 2: Technical Lead / Architect

**Demographics**:
- **Role**: Tech Lead, Software Architect
- **Organization Size**: Startup to Enterprise
- **Technical Level**: Senior to Principal

**Goals**:
- Establish development standards for AI-assisted teams
- Ensure architectural decisions are documented
- Maintain project memory across team changes

**Pain Points**:
- Team members using AI without governance
- Architectural drift over time
- Knowledge loss when team changes

**Use Cases**:
- Define constitutional governance rules
- Review C4 architecture diagrams
- Manage brownfield project changes

---

## Core Product Capabilities

### Current Features (v3.0.0)

1. **Multi-Platform Initialization** (`musubi init`)
   - 7 AI platform support
   - 25 skills/agents per platform
   - Steering directory setup

2. **EARS Requirements Generator** (`musubi-requirements`)
   - 5 EARS patterns (Ubiquitous, Event-Driven, etc.)
   - Interactive requirement creation
   - Validation and traceability

3. **C4/ADR Design Generator** (`musubi-design`)
   - C4 model diagrams (Context, Container, Component)
   - Architecture Decision Records
   - PlantUML/Mermaid output

4. **Constitutional Validation** (`musubi-validate`)
   - 9 Articles enforcement
   - Phase -1 Gate validation
   - Complexity checks

5. **Traceability Management** (`musubi-trace`)
   - Bidirectional tracing
   - Gap detection
   - Coverage statistics
   - Impact analysis

6. **Change Management** (`musubi-change`)
   - Delta specifications
   - Brownfield project support
   - Change impact preview

7. **Workflow Engine** (`musubi-workflow`)
   - 9-stage workflow
   - Stage validation
   - Metrics collection

8. **Code Analysis** (`musubi-analyze`)
   - Quality metrics
   - Dependency analysis
   - Security scanning

### MCP Integration (v2.0.0+)

- **CodeGraphMCPServer**: 14 MCP tools for code analysis
- **GraphRAG Search**: Semantic code understanding
- **11 Agents Enhanced**: Key agents leverage MCP tools

---

## Constitutional Governance

### 9 Constitutional Articles

| Article | Name | Description |
|---------|------|-------------|
| I | Library-First | All features begin as independent libraries |
| II | CLI Interface | All libraries expose CLI functionality |
| III | Test-First | Tests written before code (80% coverage) |
| IV | EARS Format | 5 EARS patterns for requirements |
| V | Traceability | 100% Req↔Design↔Code↔Test mapping |
| VI | Project Memory | Steering system maintains context |
| VII | Simplicity Gate | Maximum 3 sub-projects initially |
| VIII | Anti-Abstraction | Use framework APIs directly |
| IX | Integration-First | Integration tests use real services |

### Phase -1 Gates

Pre-implementation validation checkpoints for Articles VII & VIII.

---

## Product Principles

### Design Principles

1. **Multi-Platform First**
   - Every feature must work across all 7 AI platforms
   - Platform-specific optimizations secondary to cross-platform support

2. **Constitutional by Design**
   - All features enforce constitutional governance
   - Quality gates are immutable

3. **Bilingual Documentation**
   - All agent-generated documents in English and Japanese
   - Steering files maintained in both languages

### User Experience Principles

1. **Zero Configuration Start**
   - `npx musubi-sdd init` gets you started in 30 seconds
   - Sensible defaults for all platforms

2. **Progressive Disclosure**
   - Basic workflow easy to follow
   - Advanced features (MCP, GraphRAG) available when needed

3. **CLI-First, GUI-Optional**
   - Full functionality via CLI
   - GUI for visualization and exploration

---

## Success Metrics

### Adoption Metrics

| Metric | Target | Current |
|--------|--------|---------|
| npm Downloads (monthly) | Growing | Check npm |
| GitHub Stars | Growing | Check repo |
| Active Projects | N/A | Via telemetry |

### Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | > 80% | Jest coverage |
| CLI Response Time | < 500ms | Performance tests |
| Documentation Coverage | 100% | All features documented |

---

## Product Roadmap

### v3.x Series (Current)

**Focus**: Multi-agent architecture stabilization

- ✅ 7 AI platform support
- ✅ 27 specialized agents
- ✅ MCP integration
- 🔄 VS Code extension
- 🔄 Enhanced GUI

### v4.x Series (Planned)

**Focus**: Enterprise features

- Team collaboration
- Custom constitutional rules
- Enterprise MCP server
- Advanced analytics

---

## Competitive Analysis

| Framework | Multi-Platform | Constitutional | Traceability | MCP |
|-----------|----------------|----------------|--------------|-----|
| MUSUBI | ✅ 7 platforms | ✅ 9 articles | ✅ 100% | ✅ |
| cc-sdd | Claude only | Partial | Partial | ❌ |
| Steering | Single | ❌ | ❌ | ❌ |
| Serena | Single | ❌ | Partial | ❌ |

**MUSUBI Differentiation**:
- Only framework supporting 7 AI platforms
- Constitutional governance unique in market
- Full SDD lifecycle (Requirements→Design→Code→Test)

---

**Last Updated**: 2025-12-08
**Maintained By**: MUSUBI Contributors
