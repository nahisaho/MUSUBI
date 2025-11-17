# Technology Stack

## Overview
This document defines the technology choices, framework decisions, and technical constraints for this project. All development must align with these technical decisions.

**Last Updated**: 2025-01-16 by @steering

## Core Technologies

### Programming Languages
**Primary Language**: JavaScript (Node.js)
- **Version**: Node.js >=18.0.0
- **Module System**: CommonJS with dynamic ESM imports
- **Justification**: 
  - Universal availability in Node.js ecosystem
  - CLI tools benefit from CommonJS compatibility
  - Dynamic import() enables ESM dependency support (inquirer v9)

**No TypeScript**: JavaScript-only for maximum compatibility
- CLI tools prioritize simplicity and distribution
- No transpilation step required
- Direct execution with Node.js

## Framework & Libraries

### CLI Framework
**Primary Framework**: commander ^11.0.0
- **Purpose**: Command-line interface parsing and routing
- **Features**: Subcommands, flags, help text generation
- **Usage**: `musubi init`, `musubi status`, `musubi validate`, `musubi info`

### Terminal Styling
**Library**: chalk ^4.1.2 (CommonJS version)
- **Purpose**: Colored terminal output, ANSI formatting
- **Why v4**: ESM-only v5 incompatible with CommonJS
- **Usage**: Success (green), warnings (yellow), errors (red), info (blue)

### Interactive Prompts
**Library**: inquirer ^9.0.0 (ESM-only)
- **Purpose**: Interactive CLI prompts (agent selection, project type, skill selection)
- **Import Pattern**: Dynamic ESM import
  ```javascript
  const inquirer = await import('inquirer');
  await inquirer.default.prompt([...]);
  ```
- **Features**: Checkboxes, list selection, confirmation, input validation

### File System Utilities
**Library**: fs-extra ^11.0.0
- **Purpose**: Enhanced file operations (copy, ensure directories, JSON read/write)
- **Usage**: Template copying from `src/templates/` to user projects
- **Advantages**: Promise-based API, automatic directory creation

## Development Tools

### Package Management
- **Package Manager**: npm (bundled with Node.js)
- **Version**: npm 10.x (comes with Node.js 18+)
- **Lock File**: package-lock.json (committed to repository)
- **Registry**: npmjs.org (public npm registry)

### Build Tools
**No Build Step Required** - Direct JavaScript execution
- No bundler (CLI tool, not web application)
- No transpiler (JavaScript, not TypeScript)
- **Task Runner**: npm scripts only

```json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### Testing
**Unit Testing**: jest ^29.0.0
- **Test Files**: `tests/*.test.js`
- **Test Coverage Target**: 80% (Constitutional Article III)
- **Test Runner**: `npm test`

**No Integration/E2E Tests Yet**
- Future: Integration tests for full `musubi init` workflow
- Future: Snapshot tests for template validation

### Code Quality
- **Linter**: eslint ^8.50.0
  - JavaScript standard rules
  - Node.js environment
- **Formatter**: prettier ^3.0.0
  - Single quotes, no semicolons
  - 100 character line width
- **Pre-commit Hooks**: Not configured yet (future: husky + lint-staged)

## Deployment & Infrastructure

### Hosting
**Platform**: npm Registry (npmjs.org)
- **Package Name**: musubi-sdd
- **Distribution**: Public npm package
- **Installation**: `npx musubi-sdd` (on-demand) or `npm install -g musubi-sdd`
- **Registry URL**: https://www.npmjs.com/package/musubi-sdd

**No Application Hosting** - MUSUBI is a CLI tool, not a hosted service
- Users run locally via npx/npm
- No servers, containers, or cloud infrastructure
- Distribution through npm ecosystem only

### CI/CD
**Pipeline**: GitHub Actions (future)
- **Current**: Manual publish workflow
  1. Update version in package.json
  2. `npm publish`
  3. `git tag vX.Y.Z`
  4. `git push origin main --tags`
- **Future**: Automated CI/CD pipeline
  - Automated testing on PR
  - Automated publish on version tag
  - Automated changelog generation

### Monitoring & Logging
**No Monitoring Infrastructure** - CLI tool runs locally
- Users see output in their own terminals
- No centralized logging
- No application monitoring (Sentry, DataDog not applicable)
- **Error handling**: All errors shown to user via chalk-colored output

## Technical Constraints

### Performance Requirements
**Not Applicable** - MUSUBI is a CLI tool for local file operations
- Template copying: < 1 second (small files)
- Interactive prompts: Instant user feedback
- No network latency (except initial npx download from npm)

### Platform Support
- **Node.js Version**: >=18.0.0 (engines requirement in package.json)
- **Operating Systems**: Linux, macOS, Windows (wherever Node.js runs)
- **Shell**: bash, zsh, PowerShell, cmd (any terminal)
- **No Browser Requirement**: CLI tool, not web application

### Security Requirements
**Minimal Security Concerns** - Local CLI tool
- No authentication/authorization (local file operations)
- No data encryption (templates are public)
- No secret management (no secrets in MUSUBI itself)
- Users manage their own project security after template installation

## Third-Party Services

### Required Services
**npm Registry** (npmjs.org)
- **Purpose**: Package distribution and versioning
- **Cost**: Free for public packages
- **Dependency**: MUSUBI cannot function without npm ecosystem

**No Other External Services**
- No databases
- No APIs
- No cloud services
- No authentication services

## Technology Decisions & ADRs

### Architecture Decision Records

1. **Decision**: Use CommonJS instead of ESM
   - **Reason**: Better compatibility with older Node.js versions, simpler distribution
   - **Alternatives**: Pure ESM (would require Node.js 14+, more breaking changes)
   - **Date**: 2024 (original implementation)
   - **Status**: Active

2. **Decision**: Dynamic import() for inquirer v9
   - **Reason**: inquirer v9 is ESM-only, but we want to keep CLI in CommonJS
   - **Alternatives**: Downgrade to inquirer v8 (CommonJS), convert entire CLI to ESM
   - **Date**: 2025-01 (v0.1.2 bug fix)
   - **Status**: Active

3. **Decision**: chalk v4 instead of v5
   - **Reason**: v5 is pure ESM, incompatible with CommonJS CLI
   - **Alternatives**: Migrate entire CLI to ESM
   - **Date**: 2024 (original implementation)
   - **Status**: Active

4. **Decision**: Template-based distribution (copy, not symlink)
   - **Reason**: Users need to customize templates after installation
   - **Alternatives**: Symlink to node_modules (no customization), Git submodules (complex)
   - **Date**: 2024 (original design)
   - **Status**: Active

5. **Decision**: Support both Markdown and TOML formats
   - **Reason**: Gemini CLI requires TOML, others use Markdown
   - **Alternatives**: Markdown-only (exclude Gemini CLI), generate TOML from Markdown
   - **Date**: 2024 (Gemini CLI support)
   - **Status**: Active

## Deprecated Technologies

**None Currently** - MUSUBI is a new project with deliberate technology choices.

Future considerations:
- If migrating to TypeScript, document migration plan here
- If upgrading to inquirer v10+, document ESM migration strategy
- If adding new dependencies, document rationale and alternatives

## Development Environment Setup

### Prerequisites
```bash
# Required installations
Node.js 18+ (LTS recommended)
npm 10+ (bundled with Node.js 18)
git (for version control)
```

### Quick Start for MUSUBI Development
```bash
# Clone repository
git clone https://github.com/nahisaho/musubi.git
cd musubi

# Install dependencies
npm install

# Run tests
npm test

# Try CLI locally
node bin/musubi.js --version
node bin/musubi-init.js  # Interactive prompts

# Link for global testing
npm link
musubi --version

# Unlink when done
npm unlink -g musubi-sdd
```

### Publishing Workflow
```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Test locally
npx . init --claude

# 3. Publish to npm
npm publish

# 4. Push to GitHub
git push origin main --tags
```

---

**Note**: This document describes MUSUBI's technology stack - a Node.js CLI tool with minimal dependencies. Update when adding new dependencies or changing build processes.

**Last Updated**: 2025-01-16 by @steering
