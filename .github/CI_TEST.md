# CI Workflow Test

This PR tests the new GitHub Actions CI workflow implementation.

## Changes
- Added `.github/workflows/ci.yml`
- Added `format:check` script to `package.json`

## CI Jobs
- ✅ lint: ESLint & Prettier
- ✅ test: Jest Tests with coverage
- ✅ build: Build verification
- ✅ audit: Security audit

## Testing
All jobs should pass for this PR to be merged.
