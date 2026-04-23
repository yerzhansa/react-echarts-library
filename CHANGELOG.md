# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- Dev deps refresh: Storybook 8 → 10 (`@storybook/react`, `@storybook/react-vite`, `storybook`), added `@storybook/addon-a11y` for built-in accessibility audits in Storybook; Vitest 2 → 4 (`vitest`, `vitest-canvas-mock`); `@vitejs/plugin-react` 4 → 5; `jsdom` 25 → 29; `typescript` 5.7 → 5.9; `prettier` 3.4 → 3.8; Rollup plugin bumps (`@rollup/plugin-commonjs` 28 → 29, `@rollup/plugin-node-resolve` 15 → 16, `rollup-plugin-dts` 6.1 → 6.4); `echarts` devDep aligned to `^6.0.0`. Removed retired `@storybook/test`, and the legacy addons (`addon-links`, `addon-essentials`, `addon-interactions`) which no longer exist as separate packages in Storybook 10.
- `.storybook/main.ts` simplified to just the `addon-a11y` entry (Storybook 10 has the former essentials/links/interactions content baked into core).
- `vitest.setup.ts`: ResizeObserver mock converted to a class constructor — Vitest 4's `vi.fn().mockImplementation(...)` no longer behaves as a constructor when invoked via `new`.
- `release.yml`: drop the `push.tags: v*` trigger and keep only `release.types: [published]`. Previously both triggers fired on tag + Release creation, causing a duplicate `npm publish` attempt with a 403. Future releases: use `gh release create vX.Y.Z` (creates the tag and Release in one step).

### Fixed

- `npm audit` at zero vulnerabilities (was 14 on the old Storybook 8 / Vitest 2 stack).

## [1.4.0] - 2026-04-23

### Removed

- Drop deprecated `@types/echarts` dependency. ECharts 5+ ships its own types from `echarts` / `echarts/core`; the v4 DefinitelyTyped package was unused by this library and could shadow modern types for consumers. Users who relied on the global `echarts` ambient namespace should import `EChartsOption` / `EChartsType` from `echarts` directly.

### CI

- Test against both `echarts@5.6.0` and `echarts@6.0.0` on every push and pull request. The peer-dep range `^5.4.0 || ^6.0.0` is now enforced by CI, not just declared.

### Added

- Storybook `Charts/Gallery` section with 8 new examples: scatter, radar, heatmap, gauge, sankey, funnel, candlestick, and treemap. Each ships realistic sample data — copy, paste, substitute.
- New `useECharts` hook for consumers who want to own the container markup. Provides the same lifecycle as `<EChartsReact>` (init, option updates, event binding, resize, teardown) and returns a ref callback plus an instance getter. Exported from both `react-echarts-library` and `react-echarts-library/core`.
- New `Features/useECharts Hook` Storybook section with two examples: basic usage and a card with an integrated toolbar.
- New utility helpers exported from both entries: `exportToPNG(chart, opts?)` and `exportToSVG(chart, opts?)` wrap `chart.getDataURL()` with sensible defaults and optional browser auto-download when a `filename` is supplied.
- New `useChartTheme(override?)` hook for OS `prefers-color-scheme` sync — returns `'light' | 'dark'`, reacts to system theme changes, SSR-safe.
- New opt-in typed event helpers: `EChartsEventName`, `EChartsEventHandler<P>`, `EChartsEventsMap`. The existing `onEvents` prop type is unchanged; `EChartsEventsMap` is an opt-in stricter alternative for IDE completion on event names.
- New `Features/Utilities` Storybook section demonstrating PNG/SVG export with auto-download and dark-mode syncing.
- New `Features/Advanced` Storybook section with 6 examples of ECharts' non-obvious capabilities: dataset + transform, interactive dataZoom (slider + inside), real-time streaming (60-point rolling window), custom HTML tooltip formatter, linked charts via `dispatchAction`, and progressive rendering of 50,000 scatter points.

### Changed

- Internal: `EChartsCore` component refactored to delegate its lifecycle to the new `useECharts` hook — no behavior change, no public API change. Deduplicates the lifecycle logic between the hook and the component.

### Docs

- README: new **Accessibility** subsection showing how to enable ECharts' `AriaComponent` and pass ARIA attributes through the container.
- README: new **Next.js & Server-Side Rendering** section covering App Router server-component usage, `next/dynamic` for bundle deferral, and the SSR container-height pitfall.
- README: new **useECharts Hook** subsection under Examples, expanded with five complete examples — minimal usage, imperative toolbar actions, loading skeleton swap, reacting to external state combined with `useChartTheme`, and typed event handling via `EChartsEventsMap`.
- README: new **Utilities** section documenting `exportToPNG` / `exportToSVG`, `useChartTheme`, and the opt-in `EChartsEventsMap` typing.

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

