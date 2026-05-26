# Branch Protection Configuration

This document outlines the recommended branch protection rules for the `main` branch.

## Required Status Checks

The following checks should be marked as **required** before merging to `main`:

| Check | Workflow | Description |
|-------|----------|-------------|
| `contract-validation` | PR Checks | OpenAPI specification validation |
| `docs-validation` | PR Checks | Markdown documentation linting |
| `smoke-e2e` | PR Checks | Critical path E2E tests |
| `security-scan` | PR Checks | Dependency and secret scanning |

## Recommended Settings

### Pull Request Reviews
- **Require approvals**: 1 (minimum)
- **Dismiss stale reviews**: Yes
- **Require review from code owners**: Yes

### Branch Protection
- **Require branches to be up to date**: Yes
- **Require conversation resolution**: Yes
- **Include administrators**: No (for emergency fixes)

### Restrictions
- **Allow force pushes**: No
- **Allow deletions**: No

## Setup Instructions

1. Navigate to: **Settings** → **Branches** → **Branch protection rules**
2. Click **Add rule**
3. Enter branch name pattern: `main`
4. Configure the settings as documented above
5. Click **Create** or **Save changes**

## Environment Protection

For the `staging` and `production-dry-run` environments used in Manual E2E workflows:

1. Navigate to: **Settings** → **Environments**
2. Create environment: `staging`
3. Add protection rules:
   - Required reviewers (for production-like environments)
   - Wait timer (optional, for deployment gates)

## Secrets Management

Required secrets for CI/CD:

| Secret | Usage | Notes |
|--------|-------|-------|
| `NPM_TOKEN` | npm package access | Optional, for private packages |
| `CODECOV_TOKEN` | Coverage reporting | Optional, for coverage badges |

Store secrets in: **Settings** → **Secrets and variables** → **Actions**
