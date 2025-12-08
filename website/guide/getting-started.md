# Getting Started

This guide will help you get MUSUBI up and running in your project.

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- An AI coding agent (Claude Code, GitHub Copilot, Cursor, etc.)

## Installation

### Quick Install (Recommended)

```bash
# Initialize MUSUBI in your project
npx musubi-sdd init
```

This will:
1. Detect your AI agent (defaults to Claude Code)
2. Create steering files (`steering/`)
3. Install skills/commands for your agent
4. Set up constitutional governance

### Global Installation

```bash
npm install -g musubi-sdd

# Initialize for specific agent
musubi init --copilot   # GitHub Copilot
musubi init --cursor    # Cursor IDE
musubi init --claude    # Claude Code (default)
```

## Project Structure

After initialization, MUSUBI creates:

```
your-project/
├── steering/              # Project memory
│   ├── structure.md       # Architecture patterns
│   ├── tech.md            # Technology stack
│   ├── product.md         # Business context
│   ├── rules/
│   │   ├── constitution.md    # 9 articles
│   │   └── ears-format.md     # Requirements format
│   └── templates/         # Document templates
├── .claude/               # Claude Code specific
│   └── skills/            # 25 specialized skills
└── AGENTS.md              # For Copilot/Cursor
```

## First Steps

### 1. Review Steering Files

```bash
# Check project status
musubi status
```

Edit `steering/` files to match your project:

- `structure.md` - Your architecture patterns
- `tech.md` - Your technology stack
- `product.md` - Business context

### 2. Create Requirements

With your AI agent, use:

```
# Claude Code
/sdd-requirements User Authentication

# GitHub Copilot / Cursor
#sdd-requirements User Authentication
```

Or via CLI:

```bash
musubi-requirements init "User Authentication"
```

### 3. Generate Design

```
# Claude Code
/sdd-design User Authentication

# Or CLI
musubi-design init "User Authentication"
```

### 4. Break Down Tasks

```
# Claude Code
/sdd-tasks User Authentication

# Or CLI
musubi-tasks init "User Authentication"
```

### 5. Implement with Test-First

Follow the Red-Green-Blue cycle:

1. Write failing test (Red)
2. Write minimal code (Green)
3. Refactor (Blue)

### 6. Validate Compliance

```bash
# Check constitutional compliance
musubi validate

# Full validation
musubi-validate all
```

## Next Steps

- [SDD Workflow](/guide/sdd-workflow) - Understand the complete workflow
- [Constitutional Governance](/guide/constitution) - Learn the 9 articles
- [EARS Format](/guide/ears-format) - Write unambiguous requirements
- [CLI Reference](/reference/cli) - Explore all commands
