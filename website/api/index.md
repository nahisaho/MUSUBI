# API Reference

MUSUBI SDD programmatic API for Node.js integration.

## Installation

```bash
npm install musubi-sdd
```

## Quick Start

```javascript
const musubi = require('musubi-sdd');

// Initialize project
await musubi.init({
  name: 'my-project',
  platform: 'claude-code'
});

// Generate requirements
await musubi.requirements('user-auth');

// Validate constitution
const result = await musubi.validate();
console.log(result.passed); // true/false
```

## Core API

### init(options)

Initialize a new MUSUBI project.

```javascript
await musubi.init({
  name: 'project-name',      // Required: project name
  platform: 'claude-code',   // Required: target platform
  directory: './my-project', // Optional: target directory
  force: false               // Optional: overwrite existing
});
```

**Platforms**: `claude-code`, `copilot`, `cursor`, `cline`, `openhands`, `roo-code`, `windsurf`, `all`

### requirements(feature, options)

Generate or validate requirements.

```javascript
// Generate requirements
await musubi.requirements('auth-feature');

// Validate existing requirements
const validation = await musubi.requirements('auth-feature', {
  validate: true
});
```

### design(feature, options)

Generate design documents.

```javascript
await musubi.design('auth-feature', {
  template: 'c4-component', // Optional: specific template
  includeAdr: true          // Optional: include ADR
});
```

### tasks(feature, options)

Generate implementation tasks.

```javascript
const tasks = await musubi.tasks('auth-feature', {
  format: 'markdown',    // Optional: output format
  includeEstimates: true // Optional: add time estimates
});
```

### validate(options)

Validate constitutional compliance.

```javascript
// Validate all
const result = await musubi.validate();

// Validate specific article
const articleResult = await musubi.validate({
  article: 4
});

// Validate specific feature
const featureResult = await musubi.validate({
  feature: 'auth-feature'
});
```

**Returns**:

```javascript
{
  passed: true,
  violations: [],
  warnings: [],
  articles: {
    1: { passed: true, details: '...' },
    2: { passed: true, details: '...' },
    // ...
  }
}
```

### trace(options)

Generate traceability matrix.

```javascript
const matrix = await musubi.trace({
  feature: 'auth-feature', // Optional: filter by feature
  format: 'json'           // Optional: output format
});
```

### gaps(options)

Detect coverage gaps.

```javascript
const gaps = await musubi.gaps({
  feature: 'auth-feature',
  failOnGaps: true
});
```

### sync(options)

Synchronize configuration across platforms.

```javascript
await musubi.sync({
  platforms: ['claude-code', 'copilot'],
  dryRun: false
});
```

### convert(source, target)

Convert between platform formats.

```javascript
await musubi.convert('cursor', 'claude-code');
```

## Configuration

### Project Configuration

`steering/project.yml`:

```yaml
name: my-project
version: 1.0.0
platforms:
  - claude-code
  - copilot
constitution:
  version: 1.0.0
  location: steering/rules/constitution.md
```

### Programmatic Configuration

```javascript
const musubi = require('musubi-sdd');

musubi.configure({
  configPath: './custom/steering',
  storagePath: './custom/storage',
  templatesPath: './custom/templates'
});
```

## Events

```javascript
const musubi = require('musubi-sdd');

musubi.on('validation:start', (data) => {
  console.log('Starting validation...');
});

musubi.on('validation:complete', (result) => {
  console.log(`Validation ${result.passed ? 'passed' : 'failed'}`);
});

musubi.on('gap:found', (gap) => {
  console.log(`Gap found: ${gap.requirementId}`);
});
```

## CLI Integration

```javascript
const { CLI } = require('musubi-sdd');

// Run CLI command programmatically
await CLI.run(['validate', '--article', '5']);

// Get CLI instance for customization
const cli = new CLI();
cli.addCommand('custom', customHandler);
await cli.run(process.argv);
```

## Error Handling

```javascript
const { MUSUBIError, ValidationError, ConfigurationError } = require('musubi-sdd');

try {
  await musubi.validate();
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.violations);
  } else if (error instanceof ConfigurationError) {
    console.error('Configuration error:', error.message);
  } else {
    throw error;
  }
}
```

## TypeScript

```typescript
import musubi, { 
  InitOptions, 
  ValidationResult,
  TraceMatrix 
} from 'musubi-sdd';

const options: InitOptions = {
  name: 'my-project',
  platform: 'claude-code'
};

const result: ValidationResult = await musubi.validate();
```

## See Also

- [CLI Reference](/reference/cli)
- [Skills Reference](/skills/)
- [Examples](/examples/)
