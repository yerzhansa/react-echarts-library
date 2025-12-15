# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### Features

- **v1.2.0:** Add tree-shakeable core export (`react-echarts-library/core`) and Storybook setup

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

