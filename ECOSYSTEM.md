# Ecosystem Position: skintwin-workbench

> This repository is part of the [SkinTwin-AI ecosystem](https://github.com/jax-a11y/skintwin-ecosystem-design).
> Its machine-readable manifest lives at [`.skintwin/manifest.json`](.skintwin/manifest.json); the ecosystem-wide
> source of truth is [`registry/ecosystem.json`](https://github.com/jax-a11y/skintwin-ecosystem-design/blob/main/registry/ecosystem.json) in the hub repo.

**Layer:** governance · **Role:** contracts-hub

The SkinTwin Cognitive Alchemist Workbench is the contract-and-docs hub for the Shopify app that acts as the
ecosystem's "central nervous system". It holds the Alchemist Engine specification (Elixirs, Tensors, Reactor
Vessels) along with the workbench and Shopify app + MRP/SCM OpenAPI contracts, validated by Spectral linting
and exercised end-to-end against MSW mocks. As a governance-layer repo it publishes specs that downstream
cognitive and commerce-runtime services build against, while its MRP/SCM planning surface draws on the
federated ERP layer's procurement domain.

## Provides

- `alchemist-engine-spec` — Alchemist Engine cognitive architecture spec and MRP/workbench OpenAPI contracts

## Consumes

- `procurement-api` — Ingredient sourcing, suppliers, RFQ procurement lifecycle — concrete procurement domain of the Federated ERP layer

## CI

This repo runs its own `pr-checks.yml` workflow (Spectral OpenAPI lint, oasdiff breaking-change check) and does
not currently call the hub's reusable workflows. Shared `workflow_call` CI templates are documented in
[`ci/README.md`](https://github.com/jax-a11y/skintwin-ecosystem-design/blob/main/ci/README.md) in the hub repo.
