# ADR-P1-003: VS Code Extension Architecture

| Item | Content |
|------|---------|
| **Status** | Proposed |
| **Date** | 2025-12-07 |
| **Deciders** | @nahisaho |
| **Related** | REQ-P1-003 |

---

## Context

MUSUBI needs a VS Code extension to improve developer experience and increase visibility through the VS Code Marketplace. Currently, MUSUBI operates via CLI commands and agent prompts, which requires context switching and manual file navigation.

### Current Pain Points

1. **Context Switching**: Users must switch between terminal and editor
2. **Discoverability**: CLI commands are hard to discover for new users
3. **Visibility**: Steering state and compliance status are not visible at a glance
4. **Marketplace Exposure**: No presence on VS Code Marketplace (70%+ editor market share)

---

## Decision

We will build a **native VS Code extension** using the VS Code Extension API with the following architecture:

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    VS Code Extension Host                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Sidebar    │  │   Status     │  │   Command Palette    │  │
│  │   Panel      │  │   Bar        │  │   Integration        │  │
│  │              │  │              │  │                      │  │
│  │ - Steering   │  │ - Compliance │  │ - /sdd-init          │  │
│  │ - Reqs List  │  │ - Trace %    │  │ - /sdd-validate      │  │
│  │ - Tasks      │  │ - Agent      │  │ - /sdd-requirements  │  │
│  │ - Agents     │  │              │  │ - /sdd-design        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Core Services                          │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ Steering    │  │ Requirement │  │ Traceability    │   │  │
│  │  │ Parser      │  │ Parser      │  │ Analyzer        │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ CLI Bridge  │  │ File        │  │ Workspace       │   │  │
│  │  │ (musubi-*)  │  │ Watcher     │  │ State Manager   │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Workspace (File System)                       │
├─────────────────────────────────────────────────────────────────┤
│  steering/           storage/specs/        .claude/skills/      │
│  ├── product.md      ├── requirements/     └── *.md             │
│  ├── structure.md    └── designs/                               │
│  └── tech.md                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Choices

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Language** | TypeScript | VS Code native, type safety |
| **Build** | esbuild | Fast bundling, VS Code recommended |
| **UI Framework** | VS Code Webview | Native look, no external deps |
| **State Management** | VS Code Memento | Persistent workspace state |
| **Testing** | @vscode/test-electron | Official testing framework |

### Key Design Decisions

#### 1. CLI Bridge Pattern

The extension will **delegate to existing CLI commands** rather than reimplementing logic:

```typescript
// Extension calls CLI internally
async function validateConstitution(): Promise<ValidationResult> {
  const result = await execAsync('npx musubi-sdd validate');
  return parseValidationOutput(result);
}
```

**Rationale**:
- Single source of truth (CLI)
- Faster development
- Easier maintenance
- Consistent behavior

#### 2. File Watcher for Real-time Updates

```typescript
const steeringWatcher = vscode.workspace.createFileSystemWatcher(
  '**/steering/**/*.md'
);

steeringWatcher.onDidChange(uri => {
  refreshSteeringView();
  updateStatusBar();
});
```

#### 3. TreeView for Requirements

```typescript
class RequirementTreeProvider implements vscode.TreeDataProvider<Requirement> {
  getTreeItem(req: Requirement): vscode.TreeItem {
    return {
      label: `${req.id}: ${req.title}`,
      description: req.status,
      iconPath: getStatusIcon(req.status),
      command: {
        command: 'musubi.openRequirement',
        arguments: [req]
      }
    };
  }
}
```

#### 4. Status Bar Integration

```
┌─────────────────────────────────────────────────────────────────┐
│ ... │ MUSUBI: ✓ 9/9 │ Trace: 85% │ @orchestrator │ ...         │
└─────────────────────────────────────────────────────────────────┘
       │              │             │
       │              │             └── Active agent selector
       │              └── Traceability coverage
       └── Constitutional compliance (9 articles)
```

---

## Alternatives Considered

### Alternative 1: Web-based UI (Webview only)

**Pros**: Rich UI, familiar web technologies
**Cons**: Heavy, slow startup, not native feel
**Decision**: Rejected - Native VS Code UI preferred for first version

### Alternative 2: Language Server Protocol (LSP)

**Pros**: Powerful diagnostics, cross-editor support
**Cons**: Complex implementation, overkill for current needs
**Decision**: Deferred to Phase 2 (inline annotations)

### Alternative 3: Separate Electron App

**Pros**: Full control over UI
**Cons**: Separate installation, no editor integration
**Decision**: Rejected - Defeats purpose of editor integration

---

## Implementation Phases

### Phase 1: MVP (v0.1.0) - 2 weeks

| Feature | Description | Priority |
|---------|-------------|----------|
| Project Detection | Detect MUSUBI projects (steering/ exists) | Must |
| Sidebar: Steering View | Display product.md, structure.md, tech.md | Must |
| Status Bar | Show compliance status | Must |
| Command: Init | `MUSUBI: Initialize Project` | Must |
| Command: Validate | `MUSUBI: Validate Constitution` | Must |

### Phase 2: Core Features (v0.2.0) - 2 weeks

| Feature | Description | Priority |
|---------|-------------|----------|
| Sidebar: Requirements Tree | List all requirements with status | Must |
| Sidebar: Tasks Tree | List tasks with progress | Should |
| Command: Requirements | Generate EARS requirements | Must |
| Command: Design | Generate C4 + ADR | Must |
| Quick Pick: Agent Select | Choose from 25 agents | Should |

### Phase 3: Advanced (v0.3.0) - 2 weeks

| Feature | Description | Priority |
|---------|-------------|----------|
| Traceability Matrix | Interactive graph view | Should |
| Inline Annotations | Show REQ-IDs in code | Could |
| Diagnostics | Highlight compliance issues | Could |
| Settings UI | Configure MUSUBI options | Should |

### Phase 4: Polish & Publish (v1.0.0) - 1 week

| Feature | Description | Priority |
|---------|-------------|----------|
| Marketplace Publish | Submit to VS Code Marketplace | Must |
| Icon & Branding | Extension icon, screenshots | Must |
| Documentation | README, CHANGELOG, demo GIF | Must |
| Localization | Japanese language support | Should |

---

## Consequences

### Positive

1. **Improved DX**: One-click access to all MUSUBI features
2. **Visibility**: Marketplace exposure to millions of developers
3. **Discoverability**: Command palette shows all available actions
4. **Real-time Feedback**: Status bar shows compliance at a glance

### Negative

1. **Maintenance**: Additional codebase to maintain
2. **VS Code Dependency**: Tied to VS Code release cycle
3. **Learning Curve**: Team needs VS Code Extension API knowledge

### Risks

| Risk | Mitigation |
|------|------------|
| Complex API | Start with simple features, iterate |
| Performance | Use lazy loading, cache parsed files |
| Breaking Changes | Pin VS Code engine version, test on multiple versions |

---

## References

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
