---
name: web-gui
version: 0.1.0
description: MUSUBI Web GUI Dashboard for SDD workflow visualization
author: MUSUBI Contributors
type: skill
---

# Web GUI Dashboard

MUSUBI Web GUI provides a visual dashboard for Specification Driven Development workflow management.

## Overview

The Web GUI Dashboard provides:

- **Real-time Project Monitoring**: Live updates via WebSocket
- **Workflow Visualization**: Visual SDD stage tracking
- **Traceability Matrix**: Requirements-to-implementation mapping
- **Constitution Viewer**: Constitutional governance display
- **Coverage Statistics**: Implementation coverage tracking

## Commands

### Start Server

```bash
musubi-gui start
```

Options:

- `-p, --port <port>` - Server port (default: 3000)
- `-d, --dir <directory>` - Project directory (default: current)
- `--no-open` - Don't open browser automatically

### Development Mode

```bash
musubi-gui dev
```

Enables hot reload for development.

### Project Status

```bash
musubi-gui status
```

Shows project status summary in terminal.

### Traceability Matrix

```bash
musubi-gui matrix
```

Displays traceability matrix in terminal.

## API Endpoints

### Project

- `GET /api/project` - Get project overview
- `GET /api/health` - Health check

### Steering

- `GET /api/steering` - Get steering files
- `GET /api/constitution` - Get constitution

### Specifications

- `GET /api/specs` - List all specs
- `GET /api/specs/:id` - Get specific spec
- `GET /api/specs/:id/tasks` - Get tasks for spec

### Traceability

- `GET /api/traceability` - Get traceability matrix
- `GET /api/traceability/graph` - Get graph data for visualization
- `GET /api/coverage` - Get coverage statistics

### Workflow

- `GET /api/workflow` - Get workflow stages
- `GET /api/workflow/:featureId` - Get feature workflow state
- `GET /api/workflows` - Get all workflows

## WebSocket Events

The server sends real-time updates via WebSocket:

- `project:init` - Initial project state on connection
- `file:changed` - File was modified
- `file:added` - New file was added
- `file:removed` - File was deleted

## Architecture

```
src/gui/
├── server.js              # Express + WebSocket server
├── public/
│   └── index.html         # Single-page dashboard
└── services/
    ├── index.js           # Service exports
    ├── project-scanner.js # Project structure scanner
    ├── file-watcher.js    # File system watcher
    ├── workflow-service.js    # Workflow management
    └── traceability-service.js # Traceability matrix
```

## Dashboard Views

### Dashboard

Overview of project status, statistics, and recent specifications.

### Workflow

Visual representation of SDD workflow stages:

1. Steering
2. Requirements
3. Design
4. Tasks
5. Implementation
6. Review
7. Validation
8. Completion

### Requirements

List of all requirements with EARS pattern detection.

### Traceability

Matrix showing links between requirements, designs, tasks, and implementations.

### Constitution

Display of constitutional articles governing the project.

## Integration

### With MUSUBI CLI

The GUI complements the CLI tools:

```bash
# Initialize project
musubi init

# Start GUI to visualize
musubi-gui start

# Create requirements (CLI updates GUI in real-time)
musubi requirements add "Login Feature"
```

### With Browser Agent

Use with browser automation for testing:

```bash
# Start GUI
musubi-gui start

# In another terminal, test the GUI
musubi-browser run "navigate to http://localhost:3000" \
                   "assert Dashboard is visible"
```

## Customization

### Custom Port

```bash
musubi-gui start -p 8080
```

### Different Project

```bash
musubi-gui start -d /path/to/project
```

## Best Practices

1. **Keep GUI running during development** for real-time feedback
2. **Use WebSocket events** for automation integration
3. **Check traceability matrix** before releases
4. **Monitor coverage statistics** for completeness
5. **Review constitution articles** for governance compliance
