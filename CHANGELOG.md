# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2025-12-19

### Features

- **ECharts 6 Support:** Add ECharts 6.0 to peer dependencies (`^5.4.0 || ^6.0.0`)
- **React Server Components:** Add `'use client'` directive for Next.js App Router compatibility

### Changed

- Configure Rollup to preserve `'use client'` directive in bundled output
- Simplify chart cleanup - rely on ECharts `dispose()` for internal cleanup

## [1.2.0]

### Features

- Add tree-shakeable core export (`react-echarts-library/core`) and Storybook setup

- **v1.1.0:** Add production-ready features
  - Container-based resize detection using ResizeObserver
  - Efficient prop comparison with fast-deep-equal
  - Loading state support (showLoading, loadingOption)
  - Update control props (notMerge, lazyUpdate, shouldSetOption, replaceMerge)
  - Renderer selection (Canvas/SVG) via opts prop
  - HTML attribute passthrough (data-testid, aria-*, etc.)
  - Ref access to ECharts instance (getEchartsInstance)
  - Test suite with Vitest and Testing Library

### CI

- Add GitHub Actions for npm release with provenance
- Switch to npm Trusted Publishing (OIDC)
- Use Node.js 20 for CI pipeline
- Use PAT for changelog PR creation

