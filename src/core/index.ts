"use client";

/**
 * EChartsCore - Tree-shakeable React wrapper for Apache ECharts
 *
 * This entry point exports the core component that accepts an echarts instance,
 * allowing you to import only the charts and components you need.
 *
 * @example
 * ```tsx
 * import EChartsCore from 'react-echarts-library/core';
 * import * as echarts from 'echarts/core';
 * import { BarChart } from 'echarts/charts';
 * import { GridComponent, TooltipComponent } from 'echarts/components';
 * import { CanvasRenderer } from 'echarts/renderers';
 *
 * // Register only what you need
 * echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);
 *
 * function MyChart() {
 *   return (
 *     <EChartsCore
 *       echarts={echarts}
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
export { EChartsCore, EChartsCore as default } from "../core";
export type {
  EChartsCoreProps,
  EChartsReactRef,
  EChartsInitOpts,
  EChartsLoadingOption,
  EChartsCore as EChartsCoreType,
} from "../types";
