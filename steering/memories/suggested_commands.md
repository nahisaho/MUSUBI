# Suggested Commands

Frequently used commands for MUSUBI development, testing, and operations.

---

## MUSUBI CLI Commands

### Project Initialization

```bash
# Initialize new SDD project
musubi-init

# Initialize with specific platform
musubi-init --platform copilot
musubi-init --platform claude-code
musubi-init --platform cursor
```

### Agent Invocation (in AI chat)

```
#sdd-steering                    # Generate/update project memory
#sdd-requirements <feature>      # Create EARS requirements
#sdd-design <feature>            # Generate C4 + ADR design
#sdd-tasks <feature>             # Break down into tasks
#sdd-implement <feature>         # Execute implementation
#sdd-validate <feature>          # Validate constitutional compliance
#sdd-document <feature>          # Generate documentation
#sdd-review <feature>            # Quality assurance review
```

---

## npm Commands

### Package Management

```bash
# Install dependencies
npm install

# Install globally
npm install -g musubi-sdd

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Development

```bash
# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting without changing
npm run format:check
```

### Publishing

```bash
# Bump version (patch: 0.1.6 -> 0.1.7)
npm version patch

# Bump version (minor: 0.1.7 -> 0.2.0)
npm version minor

# Bump version (major: 0.2.0 -> 1.0.0)
npm version major

# Publish to npm
npm publish

# View package info
npm info musubi-sdd
```

---

## Git Commands

### Basic Operations

```bash
# Check status
git status

# Add all changes
git add -A

# Add specific file
git add path/to/file

# Commit with message
git commit -m "feat: Add new feature"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management

```bash
# Create new branch
git checkout -b feature/branch-name

# Switch to branch
git checkout main

# List branches
git branch -a

# Delete local branch
git branch -d branch-name
```

### History and Inspection

```bash
# View commit history
git log

# View compact log
git log --oneline

# View specific file history
git log -- path/to/file

# Show commit details
git show commit-hash

# View changes
git diff

# View staged changes
git diff --staged
```

### Undoing Changes

```bash
# Unstage file
git reset HEAD path/to/file

# Discard local changes
git checkout -- path/to/file

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## File Operations

### Navigation

```bash
# Change directory
cd steering/memories

# Go to parent directory
cd ..

# Go to home directory
cd ~

# Go to project root
cd ~/GitHub/musubi
```

### File Management

```bash
# List files
ls -la

# Create directory
mkdir -p steering/memories

# Create file
touch filename.md

# Copy file
cp source.md destination.md

# Move/rename file
mv oldname.md newname.md

# Remove file
rm filename.md

# Remove directory
rm -rf directory-name
```

### Viewing Files

```bash
# View file contents
cat filename.md

# View with pagination
less filename.md

# View first 10 lines
head filename.md

# View last 10 lines
tail filename.md

# View first 20 lines
head -n 20 filename.md

# Search in files
grep "search term" filename.md

# Search recursively
grep -r "search term" directory/
```

---

## Agent Development Commands

### Creating New Agent

```bash
# 1. Create agent directory
mkdir -p src/templates/agents/claude-code/skills/agent-name

# 2. Create SKILL.md
touch src/templates/agents/claude-code/skills/agent-name/SKILL.md

# 3. Create meta.json
touch src/templates/agents/claude-code/skills/agent-name/meta.json

# 4. Test agent
# (Use in AI chat with #sdd-agent-name)
```

### Modifying Agent

```bash
# 1. Edit SKILL.md
code src/templates/agents/claude-code/skills/agent-name/SKILL.md

# 2. Update meta.json if needed
code src/templates/agents/claude-code/skills/agent-name/meta.json

# 3. Test changes
# (Use in AI chat)

# 4. Commit changes
git add -A
git commit -m "feat: Update agent-name agent"
git push
```

---

## Documentation Commands

### Creating Bilingual Docs

```bash
# 1. Create English version
touch docs/feature.md

# 2. Create Japanese version
touch docs/feature.ja.md

# 3. Edit both files
code docs/feature.md docs/feature.ja.md

# 4. Verify both exist
ls docs/feature*
```

### Updating Documentation

```bash
# Update English version
code README.md

# Update Japanese version
code README.ja.md

# Verify synchronization
diff README.md README.ja.md
# (Should show only language differences)
```

---

## Testing Commands

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- tests/cli.test.js

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Verbose output
npm test -- --verbose
```

### Debugging Tests

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test
npm test -- -t "test name"
```

---

## Memory System Commands

### Reading Memories

```bash
# View all memory files
ls -la steering/memories/

# Read architecture decisions
cat steering/memories/architecture_decisions.md

# Read development workflow
cat steering/memories/development_workflow.md

# Read domain knowledge
cat steering/memories/domain_knowledge.md

# Read suggested commands
cat steering/memories/suggested_commands.md

# Read lessons learned
cat steering/memories/lessons_learned.md
```

### Updating Memories

```bash
# Edit architecture decisions
code steering/memories/architecture_decisions.md

# Add new lesson learned
code steering/memories/lessons_learned.md

# Update workflow
code steering/memories/development_workflow.md

# Commit memory updates
git add steering/memories/
git commit -m "docs: Update project memories"
git push
```

---

## Build and Release Commands

### Pre-release Checklist

```bash
# 1. Run all tests
npm test

# 2. Check linting
npm run lint

# 3. Format code
npm run format

# 4. Generate coverage
npm run test:coverage

# 5. Build documentation (if applicable)
npm run build:docs
```

### Release Process

```bash
# 1. Update CHANGELOG.md
code CHANGELOG.md

# 2. Bump version
npm version patch  # or minor, or major

# 3. Push with tags
git push origin main --tags

# 4. Publish to npm
npm publish

# 5. Verify publication
npm info musubi-sdd
```

---

## Troubleshooting Commands

### Checking Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check musubi-sdd installation
npm list -g musubi-sdd

# Verify musubi-init available
which musubi-init
```

### Clearing Cache

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall dependencies
npm install
```

### Fixing Issues

```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm

# Reinstall package globally
npm uninstall -g musubi-sdd
npm install -g musubi-sdd

# Reset Git state
git reset --hard HEAD
git clean -fd
```

---

## Performance Commands

### Monitoring

```bash
# Check file sizes
du -sh steering/

# Count lines of code
find src -name "*.js" | xargs wc -l

# Find large files
find . -type f -size +1M

# Disk usage
df -h
```

### Optimization

```bash
# Remove development dependencies from bundle
npm prune --production

# Analyze bundle size
npm run analyze  # (if script exists)
```

---

## Platform-Specific Commands

### GitHub Copilot

```bash
# Initialize for GitHub Copilot
musubi-init --platform copilot

# Check Copilot instructions
cat .github/copilot-instructions.md
```

### Claude Code

```bash
# Initialize for Claude Code
musubi-init --platform claude-code

# View Claude Code skills
ls -la src/templates/agents/claude-code/skills/
```

### Cursor

```bash
# Initialize for Cursor
musubi-init --platform cursor

# Check Cursor configuration
cat .cursor/instructions.md
```

---

## Quick Reference

### Daily Development

```bash
# Start development session
cd ~/GitHub/musubi
git pull origin main
npm test

# Make changes
code .

# Commit and push
npm run lint:fix
npm run format
npm test
git add -A
git commit -m "type: message"
git push origin main
```

### Quick Fixes

```bash
# Fix all auto-fixable issues
npm run lint:fix && npm run format

# Run full quality check
npm run lint && npm test

# Clean restart
rm -rf node_modules && npm install && npm test
```

---

## Environment Variables

```bash
# Set npm registry (if using private registry)
export NPM_REGISTRY=https://registry.npmjs.org/

# Set Node environment
export NODE_ENV=development  # or production

# View all environment variables
env | grep -i node
```

---

## Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# MUSUBI shortcuts
alias musubi='cd ~/GitHub/musubi'
alias mt='npm test'
alias ml='npm run lint:fix'
alias mf='npm run format'
alias mcheck='npm run lint && npm run format:check && npm test'
alias mpub='npm version patch && npm publish && git push origin main --tags'

# Git shortcuts
alias gs='git status'
alias ga='git add -A'
alias gc='git commit -m'
alias gp='git push origin main'
alias gl='git log --oneline'
```

---

**Note**: This file lists frequently used commands. For workflow procedures, see `development_workflow.md`. For domain concepts, see `domain_knowledge.md`.
