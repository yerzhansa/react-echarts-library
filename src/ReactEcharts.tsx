import React, { forwardRef } from "react";
import * as echarts from "echarts/core";
import { EChartsCore } from "./core";
import type { EChartsReactProps, EChartsReactRef } from "./types";

// Import all chart types
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  SunburstChart,
  CustomChart,
} from "echarts/charts";

// Import all components
import {
  GridComponent,
  PolarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  BrushComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  AriaComponent,
} from "echarts/components";

// Import renderers
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

// Register all charts, components, and renderers
echarts.use([
  // Charts
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  SunburstChart,
  CustomChart,
  // Components
  GridComponent,
  PolarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  BrushComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  AriaComponent,
  // Renderers
  CanvasRenderer,
  SVGRenderer,
]);

/**
 * EChartsReact - A modern React wrapper for Apache ECharts with all charts pre-registered.
 *
 * This component includes all ECharts chart types, components, and renderers.
 * For tree-shaking support, use EChartsCore from 'react-echarts-library/core' instead.
 *
 * Features:
 * - Container-based resize detection (ResizeObserver)
 * - Loading state support
 * - Update control (notMerge, lazyUpdate, shouldSetOption)
 * - Renderer selection (Canvas/SVG)
 * - Full TypeScript support
 * - Ref access to ECharts instance
 *
 * @example
 * ```tsx
 * import EChartsReact from 'react-echarts-library';
 *
 * <EChartsReact
 *   option={{
 *     xAxis: { type: 'category', data: ['A', 'B', 'C'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'bar', data: [10, 20, 30] }]
 *   }}
 * />
 * ```
 */
export const EChartsReact = forwardRef<EChartsReactRef, EChartsReactProps>(
  (props, ref) => {
    return <EChartsCore ref={ref} echarts={echarts} {...props} />;
  }
);

EChartsReact.displayName = "EChartsReact";
export default EChartsReact;

// Re-export types from types.ts for backwards compatibility
export type {
  EChartsReactProps,
  EChartsReactRef,
  EChartsInitOpts,
  EChartsLoadingOption,
} from "./types";
