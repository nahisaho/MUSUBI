# MUSUBI GitHub Action

Use MUSUBI SDD (Specification-Driven Development) in your GitHub Actions workflows.

## Quick Start

```yaml
name: MUSUBI Validation

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: MUSUBI Validation
        uses: your-org/musubi@v1
        with:
          command: validate
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `command` | Command to run: `validate`, `analyze`, `gaps`, `trace`, `all` | `validate` |
| `feature` | Feature name to analyze (optional) | `''` |
| `node-version` | Node.js version | `18` |
| `working-directory` | Working directory | `.` |
| `fail-on-gaps` | Fail if traceability gaps found | `false` |
| `constitution-check` | Run constitutional governance validation | `true` |
| `output-format` | Output format: `text`, `json`, `markdown` | `markdown` |

## Outputs

| Output | Description |
|--------|-------------|
| `validation-result` | `passed` or `failed` |
| `coverage` | Requirements coverage percentage |
| `gaps-count` | Number of traceability gaps |
| `report-path` | Path to generated report |

## Examples

### Full Validation

```yaml
- name: MUSUBI Full Check
  uses: your-org/musubi@v1
  with:
    command: all
    fail-on-gaps: true
    constitution-check: true
```

### Feature-Specific Analysis

```yaml
- name: Analyze Feature
  uses: your-org/musubi@v1
  with:
    command: analyze
    feature: user-authentication
```

### Check Coverage Before Merge

```yaml
- name: Coverage Check
  id: musubi
  uses: your-org/musubi@v1
  with:
    command: analyze

- name: Require Minimum Coverage
  run: |
    if [ "${{ steps.musubi.outputs.coverage }}" -lt 80 ]; then
      echo "Coverage ${{ steps.musubi.outputs.coverage }}% is below 80%"
      exit 1
    fi
```

### Constitutional Governance Only

```yaml
- name: Constitution Check
  uses: your-org/musubi@v1
  with:
    command: validate
    constitution-check: true
```

## Reusable Workflow

You can also use MUSUBI as a reusable workflow:

```yaml
# .github/workflows/musubi.yml (in your repo)
name: MUSUBI
on:
  workflow_call:
    inputs:
      feature:
        type: string
        required: false

jobs:
  validate:
    uses: your-org/musubi/.github/workflows/musubi-reusable.yml@v1
    with:
      feature: ${{ inputs.feature }}
```

## Requirements

Your project should have:
- `steering/` directory with project context
- `steering/rules/constitution.md` for constitutional governance
- `storage/specs/` for feature specifications

## Related

- [MUSUBI Documentation](https://your-org.github.io/musubi/)
- [Constitutional Governance](https://your-org.github.io/musubi/guide/constitutional-governance.html)
- [Traceability](https://your-org.github.io/musubi/guide/traceability.html)
