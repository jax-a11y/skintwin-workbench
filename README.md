# SkinTwin Cognitive Alchemist Workbench

**AI-driven beauty-tech ecosystem integration platform**

[![Organization](https://img.shields.io/badge/org-skintwin--ai-blue)](https://github.com/skintwin-ai)
[![Enterprise](https://img.shields.io/badge/enterprise-Kawaii-purple)](https://github.com/enterprises/kawaii)
[![PR Checks](https://github.com/jax-a11y/skintwin-workbench/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/jax-a11y/skintwin-workbench/actions/workflows/pr-checks.yml)
[![Nightly E2E](https://github.com/jax-a11y/skintwin-workbench/actions/workflows/nightly-e2e.yml/badge.svg)](https://github.com/jax-a11y/skintwin-workbench/actions/workflows/nightly-e2e.yml)

## Overview

The SkinTwin Cognitive Alchemist Workbench is implemented as a **Shopify app** that serves as the central nervous system for an AI-driven beauty-tech ecosystem. The app integrates AI diagnostics, white-label manufacturing, and salon operations while adding built-in **MRP (material requirements planning)** and **SCM (supply chain management)** orchestration.

## Architecture

The Alchemist Engine transforms raw data into personalized skincare solutions through a framework of:

- **Elixirs**: Transformation recipes that process input data through multi-step pipelines
- **Tensors**: Multi-dimensional data structures representing skin diagnostics, client history, and market context
- **Reactor Vessels**: Processing containers that execute transformations

## Ecosystem Integration

The workbench integrates with four key pillars of the beauty-tech stack:

| Pillar | Platform | Role |
|--------|----------|------|
| **Commerce Channel** | Shopify | Embedded app for storefront/admin workflows |
| **AI Diagnostics** | Perfect Corp | Medical-grade skin analysis via API |
| **B2B Management** | MioSalon | Salon/spa management SaaS |
| **B2C Marketplace** | Welns.io / GoBeauty | Consumer booking platforms |
| **Manufacturing** | ViaGlamour | White-label cosmetics & dropshipping |

## Documentation

- [Alchemist Engine Specification](docs/Alchemist-Engine.md)
- [Integration Analysis Report](docs/research/integration_analysis.md)
- [API Specification](docs/api/openapi.json)
- [Shopify App + MRP/SCM API Specification](docs/api/shopify-app-openapi.json)

### Research Notes

- [Perfect Corp AI Skin Diagnostic](docs/research/perfectcorp_notes.md)
- [ViaGlamour White-Label Manufacturing](docs/research/viaglamour_notes.md)
- [MioSalon & Welns.io Relationship](docs/research/miosalon_notes.md)
- [GoBeauty Regional Marketplace](docs/research/gobeauty_notes.md)

## Key Features

### AI Skin Analysis Integration
- 16 skin concern detection (spots, wrinkles, pores, moisture, etc.)
- 8 skin type classification
- 95% test-retest reliability (dermatologist verified)
- HIPAA and GDPR compliant

### Personalized Product Formulation
- Integration with 800+ white-label formulas
- Custom ingredient mapping based on skin analysis
- Automated manufacturing and dropshipping

### Salon & Spa Orchestration
- Appointment booking integration
- Client history and treatment tracking
- Multi-location management

### Shopify App + MRP/SCM Operations
- Embedded Shopify app for product, order, and webhook workflows
- MRP planning for formula demand, component requirements, and production lots
- SCM orchestration for purchase orders, supplier lead times, and fulfillment updates

## Getting Started

```bash
# Clone the repository
git clone https://github.com/jax-a11y/skintwin-workbench.git

# Navigate to the project
cd skintwin-workbench

# Install dependencies
npm install

# Validate API contracts
npm run validate

# Run smoke E2E tests
npm run test:e2e:smoke
```

## Development

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run validate` | Run all validation checks (OpenAPI + docs) |
| `npm run lint:openapi` | Validate OpenAPI specifications |
| `npm run lint:docs` | Lint markdown documentation |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:smoke` | Run critical path E2E tests (fast) |
| `npm run test:e2e:exhaustive` | Run exhaustive E2E tests (comprehensive) |
| `npm run test:coverage` | Run tests with coverage report |

### CI/CD Workflows

The repository includes comprehensive GitHub Actions workflows:

| Workflow | Trigger | Description |
|----------|---------|-------------|
| **PR Checks** | Push/PR to main | Fast validation: OpenAPI, docs, smoke E2E, security |
| **Nightly E2E** | Daily at 2:00 UTC | Exhaustive E2E tests across all endpoints and edge cases |
| **Manual E2E** | Manual dispatch | Targeted test runs with configurable suite and environment |

### Test Coverage

E2E tests cover:
- ✅ **Critical Path**: App install → Order webhook → MRP plan → Purchase order → Fulfillment
- ✅ **Negative Scenarios**: Missing fields, invalid enums, constraint violations
- ✅ **State Transitions**: Purchase order lifecycle, fulfillment status progression
- ✅ **Contract Conformance**: Schema validation for all API responses
- ✅ **Edge Cases**: Idempotency, duplicate handling, boundary conditions

## License

Copyright © 2026 SkinTwin AI. All rights reserved.

## Enterprise

This project is part of the [Kawaii Enterprise](https://github.com/enterprises/kawaii).
