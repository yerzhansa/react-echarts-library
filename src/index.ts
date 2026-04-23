"use client";

/**
 * react-echarts-library - A modern React wrapper for Apache ECharts
 *
 * This is the main entry point that includes all ECharts chart types,
 * components, and renderers pre-registered for convenience.
 *
 * For tree-shaking support (smaller bundle size), use:
 * import EChartsCore from 'react-echarts-library/core';
 *
 * @example
 * ```tsx
 * import EChartsReact from 'react-echarts-library';
 *
 * function MyChart() {
 *   return (
 *     <EChartsReact
 *       option={{
 *         xAxis: { type: 'category', data: ['A', 'B', 'C'] },
 *         yAxis: { type: 'value' },
 *         series: [{ type: 'bar', data: [10, 20, 30] }]
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export {
  EChartsReact,
  EChartsReact as default,
} from "./ReactEcharts";

export { useECharts } from "./useECharts";
export { exportToPNG, exportToSVG } from "./utils/export";
export { useChartTheme } from "./utils/useChartTheme";

export type {
  EChartsReactProps,
  EChartsReactRef,
  EChartsInitOpts,
  EChartsLoadingOption,
  EChartsEventName,
  EChartsEventHandler,
  EChartsEventsMap,
} from "./types";

export type { UseEChartsOptions, UseEChartsReturn } from "./useECharts";
export type { ExportImageOptions } from "./utils/export";
export type { ChartTheme } from "./utils/useChartTheme";
