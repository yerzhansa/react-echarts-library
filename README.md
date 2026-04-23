# React ECharts Library

[![npm version](https://img.shields.io/npm/v/react-echarts-library)](https://www.npmjs.com/package/react-echarts-library)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-echarts-library)](https://bundlephobia.com/package/react-echarts-library)
[![license](https://img.shields.io/npm/l/react-echarts-library)](https://github.com/yerzhansa/react-echarts-library/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-16.8%2B%20%7C%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://yerzhansa.github.io/react-echarts-library/)

A modern, TypeScript-first React wrapper for Apache ECharts (v5 & v6). Build beautiful, interactive charts with minimal setup.

[**View Live Demo →**](https://yerzhansa.github.io/react-echarts-library/)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
  - [Bar Chart](#bar-chart)
  - [Pie Chart](#pie-chart)
  - [Event Handling](#event-handling)
  - [Chart Instance Access](#chart-instance-access)
  - [Loading State](#loading-state)
  - [Themes](#themes)
  - [SVG Renderer](#svg-renderer)
  - [Accessibility](#accessibility)
  - [useECharts Hook](#useecharts-hook)
- [Tree-Shaking](#tree-shaking)
- [Next.js & Server-Side Rendering](#nextjs--server-side-rendering)
- [Utilities](#utilities)
  - [exportToPNG / exportToSVG](#exporttopng--exporttosvg)
  - [useChartTheme](#usecharttheme)
  - [Typed Events](#typed-events)
- [API Reference](#api-reference)
  - [Props](#props)
  - [Ref Methods](#ref-methods)
  - [Init Options](#init-options)
  - [Loading Options](#loading-options)
- [TypeScript](#typescript)
- [Supported Chart Types](#supported-chart-types)
- [Contributing](#contributing)
- [License](#license)

## Features

- **React 16.8 - 19 Support** — Works with hooks-based React through the latest version
- **TypeScript First** — Full type definitions included
- **Tree-Shakeable** — Import only what you need with the `/core` export
- **20+ Chart Types** — Line, bar, pie, scatter, radar, heatmap, and more
- **Auto Resize** — Charts automatically adapt to container size changes
- **Loading States** — Built-in loading animation support
- **Event Handling** — Full access to ECharts events
- **Theme Support** — Use built-in themes or create custom ones
- **Dual Renderer** — Choose between Canvas (performance) or SVG (scalability)

## Installation

```bash
# npm
npm install react-echarts-library echarts

# yarn
yarn add react-echarts-library echarts

# pnpm
pnpm add react-echarts-library echarts
```

> **Note:** `echarts` is a peer dependency and must be installed separately.

## Quick Start

```tsx
import EChartsReact from 'react-echarts-library';

function App() {
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };

  return <EChartsReact option={option} style={{ height: 400 }} />;
}
```

## Examples

### Bar Chart

```tsx
import EChartsReact from 'react-echarts-library';

function BarChart() {
  const option = {
    title: { text: 'Sales by Month' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110]
      }
    ]
  };

  return <EChartsReact option={option} style={{ height: 400 }} />;
}
```

### Pie Chart

```tsx
import EChartsReact from 'react-echarts-library';

function PieChart() {
  const option = {
    title: { text: 'Traffic Sources', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 'bottom' },
    series: [
      {
        name: 'Source',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Affiliate' },
          { value: 300, name: 'Social' }
        ]
      }
    ]
  };

  return <EChartsReact option={option} style={{ height: 400 }} />;
}
```

### Event Handling

```tsx
import EChartsReact from 'react-echarts-library';

function ChartWithEvents() {
  const option = {
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }]
  };

  const handleEvents = {
    click: (params) => {
      console.log('Clicked:', params.name, params.value);
    },
    mouseover: (params) => {
      console.log('Hovered:', params.name);
    }
  };

  return <EChartsReact option={option} onEvents={handleEvents} style={{ height: 400 }} />;
}
```

### Chart Instance Access

Use a ref to access the underlying ECharts instance for advanced operations:

```tsx
import { useRef } from 'react';
import EChartsReact, { EChartsReactRef } from 'react-echarts-library';

function ChartWithRef() {
  const chartRef = useRef<EChartsReactRef>(null);

  const handleExport = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const url = instance.getDataURL({ type: 'png', pixelRatio: 2 });
      console.log('Chart image URL:', url);
    }
  };

  const handleResize = () => {
    chartRef.current?.getEchartsInstance()?.resize();
  };

  const option = {
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [10, 20, 30] }]
  };

  return (
    <div>
      <button onClick={handleExport}>Export as PNG</button>
      <button onClick={handleResize}>Resize</button>
      <EChartsReact ref={chartRef} option={option} style={{ height: 400 }} />
    </div>
  );
}
```

### Loading State

```tsx
import { useState, useEffect } from 'react';
import EChartsReact from 'react-echarts-library';

function ChartWithLoading() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setData([150, 230, 224, 218, 135, 147, 260]);
      setLoading(false);
    }, 2000);
  }, []);

  const option = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data }]
  };

  return (
    <EChartsReact
      option={option}
      showLoading={loading}
      loadingOption={{
        text: 'Loading...',
        color: '#5470c6',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      }}
      style={{ height: 400 }}
    />
  );
}
```

### Themes

```tsx
import EChartsReact from 'react-echarts-library';

// Built-in dark theme
function DarkThemedChart() {
  const option = { /* ... */ };
  return <EChartsReact option={option} theme="dark" style={{ height: 400 }} />;
}

// Custom theme object
function CustomThemedChart() {
  const customTheme = {
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    backgroundColor: '#1a1a2e'
  };

  const option = { /* ... */ };
  return <EChartsReact option={option} theme={customTheme} style={{ height: 400 }} />;
}
```

### SVG Renderer

Use SVG for better scaling and print quality:

```tsx
import EChartsReact from 'react-echarts-library';

function SVGChart() {
  const option = { /* ... */ };

  return (
    <EChartsReact
      option={option}
      opts={{ renderer: 'svg' }}
      style={{ height: 400 }}
    />
  );
}
```

### Accessibility

ECharts ships an `AriaComponent` — it's pre-registered in the full bundle of this library. Enable it by setting `aria.enabled: true` on your chart option, and pass through standard ARIA attributes at the container level:

```tsx
import EChartsReact from 'react-echarts-library';

function AccessibleChart() {
  const option = {
    aria: {
      enabled: true,
      label: {
        description:
          'Monthly sales from January through June, ranging from 70 to 200 units.'
      }
    },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150, 80, 70, 110] }]
  };

  return (
    <EChartsReact
      option={option}
      aria-label="Monthly sales bar chart"
      role="img"
      style={{ height: 400 }}
    />
  );
}
```

`aria.enabled` generates a descriptive summary that assistive technologies can read; `aria-label` and `role` on the container are passed straight through to the `<div>` via HTML attribute passthrough. If you use the tree-shakeable `/core` export, remember to `echarts.use([AriaComponent])` explicitly.

### useECharts Hook

If you want to own the container markup — for example, to nest the chart inside a styled card with a toolbar, or position a skeleton loader alongside it — use the `useECharts` hook directly. The hook provides the same lifecycle as `<EChartsReact>` (init, option updates, event binding, resize, teardown) but returns a ref callback plus an instance getter:

```tsx
import { useECharts } from 'react-echarts-library/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

function DashboardCard() {
  const { containerRef, getInstance } = useECharts(echarts, {
    option: {
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [10, 20, 30] }]
    }
  });

  const handleReset = () => {
    getInstance()?.dispatchAction({ type: 'restore' });
  };

  return (
    <section className="card">
      <header>
        <strong>Sales by Region</strong>
        <button onClick={handleReset}>Reset</button>
      </header>
      <div ref={containerRef} style={{ height: 320 }} />
    </section>
  );
}
```

Accepts the same options as the component, minus container-level props (`style`, `className` — those belong on your own div). Also exported from the main entry:

```tsx
import { useECharts } from 'react-echarts-library';
```

## Tree-Shaking

For smaller bundle sizes, use the `/core` export and register only the chart types you need:

```tsx
import EChartsCore from 'react-echarts-library/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only what you need
echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

function OptimizedChart() {
  const option = {
    title: { text: 'Optimized Chart' },
    tooltip: {},
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  };

  return <EChartsCore echarts={echarts} option={option} style={{ height: 400 }} />;
}
```

**Bundle size comparison:**
- Full bundle (`react-echarts-library`): ~1MB
- Tree-shaken (`react-echarts-library/core`): ~150KB (depends on charts used)

## Next.js & Server-Side Rendering

This library ships the `'use client'` directive in its bundled output, so you can import it directly from a Next.js App Router server component without any wrapping:

```tsx
// app/dashboard/page.tsx — this file is a Server Component by default
import EChartsReact from 'react-echarts-library';

export default function DashboardPage() {
  const option = {
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [150, 230, 224, 218, 135] }]
  };

  return <EChartsReact option={option} style={{ height: 400 }} />;
}
```

React will transition the chart to a Client Component at the `'use client'` boundary, and the chart renders on the client where the DOM and Canvas/SVG APIs are available.

### When to use a dynamic import

If you want to defer loading the library entirely — for example, to keep it out of the initial bundle for pages that don't always need charts — wrap with `next/dynamic`:

```tsx
'use client';
import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';

const EChartsReact = dynamic(() => import('react-echarts-library'), {
  ssr: false,
  loading: () => <div style={{ height: 400 }}>Loading chart…</div>
});

export default function Chart({ option }: { option: EChartsOption }) {
  return <EChartsReact option={option} style={{ height: 400 }} />;
}
```

`ssr: false` skips the server render pass — useful when the parent component is itself a Client Component and you want to avoid downloading the chart library until it's needed.

### Container height note

ECharts measures its container with `ResizeObserver`. During SSR the container has no measurable size until it mounts on the client — always give the container an explicit `height` (or a CSS `aspect-ratio`) so it doesn't collapse to zero on first paint. A collapsed container produces the familiar `[ECharts] Can't get DOM width or height` warning.

## Utilities

A handful of small helpers for the glue code that would otherwise repeat across every app. All exported from both entries.

### exportToPNG / exportToSVG

Wrap `chart.getDataURL()` with sensible defaults and optional auto-download:

```tsx
import { useRef } from 'react';
import EChartsReact, { EChartsReactRef, exportToPNG, exportToSVG } from 'react-echarts-library';

function ExportableChart() {
  const chartRef = useRef<EChartsReactRef>(null);

  const handleDownload = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;
    exportToPNG(chart, { filename: 'sales.png', pixelRatio: 3 });
  };

  return (
    <>
      <button onClick={handleDownload}>Download PNG</button>
      <EChartsReact ref={chartRef} option={option} style={{ height: 400 }} />
    </>
  );
}
```

- **Without `filename`**, they return the data URL so you can embed it in an `<img>` or upload to a server.
- **With `filename`**, they also trigger a browser download via an anchor click.
- `exportToSVG` prefers `chart.renderToSVGString()` when the SVG renderer is in use, otherwise falls back to `getDataURL({ type: 'svg' })`.

### useChartTheme

Sync the chart's theme to the user's OS dark-mode preference:

```tsx
import EChartsReact, { useChartTheme } from 'react-echarts-library';

function ThemedChart() {
  const theme = useChartTheme();   // 'light' | 'dark', reacts to prefers-color-scheme
  return <EChartsReact option={option} theme={theme} style={{ height: 400 }} />;
}
```

Pass an override (`useChartTheme('dark')`) when your app already owns the theme state and you want to pipe it through. SSR-safe: returns `'light'` on the server and corrects on hydration.

### Typed Events

For IDE completion on event names, use `EChartsEventsMap` as the type of your handler map instead of the default loosely-typed `Record<string, …>`:

```tsx
import EChartsReact, { EChartsEventsMap } from 'react-echarts-library';

const handlers: EChartsEventsMap = {
  click: (params, chart) => { /* params: unknown — narrow with your chart's param shape */ },
  legendselectchanged: (params) => { /* ... */ },
};

<EChartsReact option={option} onEvents={handlers} />
```

The existing loose `onEvents` prop type still works — `EChartsEventsMap` is an opt-in tighter alternative.

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `option` | `EChartsOption` | Required | ECharts configuration object |
| `theme` | `string \| object` | — | Theme name (`'dark'`) or custom theme object |
| `style` | `CSSProperties` | `{ height: 300 }` | Container inline styles |
| `className` | `string` | `''` | Container CSS class |
| `autoResize` | `boolean` | `true` | Auto-resize on container changes |
| `opts` | `EChartsInitOpts` | — | Initialization options (renderer, etc.) |
| `showLoading` | `boolean` | `false` | Show loading animation |
| `loadingOption` | `EChartsLoadingOption` | — | Loading animation configuration |
| `onChartReady` | `(chart) => void` | — | Callback when chart is initialized |
| `onEvents` | `Record<string, Function>` | `{}` | Event handlers map |
| `notMerge` | `boolean` | `false` | Replace option instead of merging |
| `lazyUpdate` | `boolean` | `false` | Defer rendering for performance |
| `replaceMerge` | `string \| string[]` | — | Keys to replace instead of merge |
| `shouldSetOption` | `(prev, curr) => boolean` | — | Custom update control |

### Ref Methods

Access via `ref.current.getEchartsInstance()`:

| Method | Description |
|--------|-------------|
| `getDataURL(opts)` | Export chart as base64 image |
| `getWidth()` | Get chart width |
| `getHeight()` | Get chart height |
| `getOption()` | Get current option configuration |
| `resize(opts?)` | Manually resize the chart |
| `dispatchAction(action)` | Trigger chart actions (highlight, etc.) |

### Init Options

Options passed to `opts` prop:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `renderer` | `'canvas' \| 'svg'` | `'canvas'` | Rendering engine |
| `devicePixelRatio` | `number` | Device default | Pixel ratio for high-DPI displays |
| `width` | `number \| 'auto'` | `'auto'` | Chart width |
| `height` | `number \| 'auto'` | `'auto'` | Chart height |
| `locale` | `string` | — | Locale for formatting |

### Loading Options

Options passed to `loadingOption` prop:

| Option | Type | Description |
|--------|------|-------------|
| `text` | `string` | Loading text |
| `color` | `string` | Spinner color |
| `textColor` | `string` | Text color |
| `maskColor` | `string` | Overlay background color |
| `fontSize` | `number` | Font size |
| `showSpinner` | `boolean` | Show spinner animation |
| `spinnerRadius` | `number` | Spinner size |

## TypeScript

The library exports all necessary types:

```tsx
import EChartsReact, {
  EChartsReactProps,
  EChartsReactRef,
  EChartsInitOpts,
  EChartsLoadingOption
} from 'react-echarts-library';

// For tree-shakeable version
import EChartsCore, { EChartsCoreProps } from 'react-echarts-library/core';
```

## Supported Chart Types

The full bundle includes all ECharts chart types:

- Line Chart
- Bar Chart
- Pie Chart
- Scatter Chart
- Radar Chart
- Heatmap Chart
- Tree Chart
- Treemap Chart
- Sunburst Chart
- Map Chart
- Graph Chart
- Gauge Chart
- Funnel Chart
- Sankey Chart
- Boxplot Chart
- Candlestick Chart
- Parallel Chart
- Lines Chart
- Effect Scatter Chart
- Pictorial Bar Chart
- Custom Chart

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# Clone the repository
git clone https://github.com/yerzhansa/react-echarts-library.git

# Install dependencies
npm install

# Run tests
npm test

# Start Storybook
npm run storybook

# Build
npm run build
```

## License

MIT
