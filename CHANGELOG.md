# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Removed

- Drop deprecated `@types/echarts` dependency. ECharts 5+ ships its own types from `echarts` / `echarts/core`; the v4 DefinitelyTyped package was unused by this library and could shadow modern types for consumers. Users who relied on the global `echarts` ambient namespace should import `EChartsOption` / `EChartsType` from `echarts` directly.

### CI

- Test against both `echarts@5.6.0` and `echarts@6.0.0` on every push and pull request. The peer-dep range `^5.4.0 || ^6.0.0` is now enforced by CI, not just declared.

### Added

- Storybook `Charts/Gallery` section with 8 new examples: scatter, radar, heatmap, gauge, sankey, funnel, candlestick, and treemap. Each ships realistic sample data — copy, paste, substitute.
- New `useECharts` hook for consumers who want to own the container markup. Provides the same lifecycle as `<EChartsReact>` (init, option updates, event binding, resize, teardown) and returns a ref callback plus an instance getter. Exported from both `react-echarts-library` and `react-echarts-library/core`.
- New `Features/useECharts Hook` Storybook section with two examples: basic usage and a card with an integrated toolbar.

### Changed

- Internal: `EChartsCore` component refactored to delegate its lifecycle to the new `useECharts` hook — no behavior change, no public API change. Deduplicates the lifecycle logic between the hook and the component.

### Docs

- README: new **Accessibility** subsection showing how to enable ECharts' `AriaComponent` and pass ARIA attributes through the container.
- README: new **Next.js & Server-Side Rendering** section covering App Router server-component usage, `next/dynamic` for bundle deferral, and the SSR container-height pitfall.
- README: new **useECharts Hook** subsection under Examples.

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

