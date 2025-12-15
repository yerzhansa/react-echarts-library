import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as echarts from "echarts/core";
import type { EChartsType, SetOptionOpts } from "echarts/core";
import { EChartsOption } from "echarts";
import isEqual from "fast-deep-equal";

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

import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

echarts.use([
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
  CanvasRenderer,
  SVGRenderer,
]);

/**
 * Initialization options passed to echarts.init()
 */
export interface EChartsInitOpts {
  /** Rendering mode: 'canvas' (default) or 'svg' */
  renderer?: "canvas" | "svg";
  /** Device pixel ratio for high-DPI displays */
  devicePixelRatio?: number;
  /** Chart width (number in pixels or 'auto' for container width) */
  width?: number | "auto";
  /** Chart height (number in pixels or 'auto' for container height) */
  height?: number | "auto";
  /** Locale for internationalization */
  locale?: string;
  /** Use dirty rectangle rendering for optimization */
  useDirtyRect?: boolean;
}

/**
 * Loading options for showLoading
 */
export interface EChartsLoadingOption {
  text?: string;
  color?: string;
  textColor?: string;
  maskColor?: string;
  zlevel?: number;
  fontSize?: number;
  showSpinner?: boolean;
  spinnerRadius?: number;
  lineWidth?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fontFamily?: string;
}

/**
 * Props for the EChartsReact component
 */
export interface EChartsReactProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** ECharts option configuration (required) */
  option: EChartsOption;
  /** Theme name (string) or custom theme object */
  theme?: string | object;
  /** Container style (default: { height: 300 }) */
  style?: React.CSSProperties;
  /** Additional CSS class name */
  className?: string;
  /** Auto-resize chart when container size changes (default: true) */
  autoResize?: boolean;
  /** Callback when chart is initialized */
  onChartReady?: (chart: EChartsType) => void;
  /** Event handlers map */
  onEvents?: Record<string, (params: unknown, chart: EChartsType) => void>;
  /** Initialization options for echarts.init() */
  opts?: EChartsInitOpts;
  /** Whether to not merge with previous option (default: false) */
  notMerge?: boolean;
  /** Keys to replace instead of merge */
  replaceMerge?: string | string[];
  /** Whether to update chart lazily (default: false) */
  lazyUpdate?: boolean;
  /** Show loading animation (default: false) */
  showLoading?: boolean;
  /** Loading animation options */
  loadingOption?: EChartsLoadingOption;
  /** Custom hook to control whether setOption should be called */
  shouldSetOption?: (
    prevProps: EChartsReactProps,
    props: EChartsReactProps
  ) => boolean;
}

/**
 * Ref handle exposed by EChartsReact
 */
export interface EChartsReactRef {
  /** Get the ECharts instance */
  getEchartsInstance: () => EChartsType | null;
}

// Props that should trigger setOption when changed
const OPTION_PROPS = [
  "option",
  "notMerge",
  "replaceMerge",
  "lazyUpdate",
] as const;

/**
 * Pick specific keys from an object
 */
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * EChartsReact - A modern React wrapper for Apache ECharts
 *
 * Features:
 * - Container-based resize detection (ResizeObserver)
 * - Loading state support
 * - Update control (notMerge, lazyUpdate, shouldSetOption)
 * - Renderer selection (Canvas/SVG)
 * - Full TypeScript support
 * - Ref access to ECharts instance
 */
export const EChartsReact = forwardRef<EChartsReactRef, EChartsReactProps>(
  (
    {
      option,
      theme,
      style = { height: 300 },
      className = "",
      autoResize = true,
      onChartReady,
      onEvents = {},
      opts,
      notMerge = false,
      replaceMerge,
      lazyUpdate = false,
      showLoading = false,
      loadingOption,
      shouldSetOption,
      ...divProps
    },
    ref
  ) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<EChartsType | null>(null);
    const prevPropsRef = useRef<EChartsReactProps | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Expose getEchartsInstance via ref
    useImperativeHandle(
      ref,
      () => ({
        getEchartsInstance: () => chartInstance.current,
      }),
      []
    );

    // Memoized resize handler
    const handleResize = useCallback(() => {
      if (chartInstance.current && !chartInstance.current.isDisposed()) {
        chartInstance.current.resize();
      }
    }, []);

    // Initialize chart
    useEffect(() => {
      if (!chartRef.current) return;

      // Dispose previous instance if exists
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // Initialize ECharts with options
      const initOpts = {
        renderer: opts?.renderer ?? "canvas",
        devicePixelRatio: opts?.devicePixelRatio,
        width: opts?.width,
        height: opts?.height,
        locale: opts?.locale,
        useDirtyRect: opts?.useDirtyRect,
      };

      const chart = echarts.init(chartRef.current, theme, initOpts);
      chartInstance.current = chart;

      // Set initial option
      const setOptionOpts: SetOptionOpts = {
        notMerge,
        lazyUpdate,
        replaceMerge,
      };
      chart.setOption(option, setOptionOpts);

      // Bind events
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chart.on(eventName, (params: unknown) => handler(params, chart));
      });

      // Handle loading state
      if (showLoading) {
        chart.showLoading("default", loadingOption);
      }

      // Notify chart ready
      if (onChartReady) {
        onChartReady(chart);
      }

      // Setup ResizeObserver for container-based resize
      if (autoResize && chartRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          // Use requestAnimationFrame to debounce resize calls
          requestAnimationFrame(handleResize);
        });
        resizeObserverRef.current.observe(chartRef.current);
      }

      // Store current props for comparison
      prevPropsRef.current = {
        option,
        theme,
        style,
        className,
        autoResize,
        onChartReady,
        onEvents,
        opts,
        notMerge,
        replaceMerge,
        lazyUpdate,
        showLoading,
        loadingOption,
        shouldSetOption,
      };

      return () => {
        // Cleanup ResizeObserver
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }

        // Dispose chart
        if (chart && !chart.isDisposed()) {
          chart.dispose();
        }
        chartInstance.current = null;
      };
      // Only re-run when theme or opts change (requires re-init)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, opts?.renderer, opts?.locale]);

    // Update chart option when props change
    useEffect(() => {
      const chart = chartInstance.current;
      if (!chart || chart.isDisposed()) return;

      const prevProps = prevPropsRef.current;

      // Check if we should update option
      if (prevProps) {
        // Use custom shouldSetOption if provided
        if (shouldSetOption) {
          const currentProps: EChartsReactProps = {
            option,
            theme,
            style,
            className,
            autoResize,
            onChartReady,
            onEvents,
            opts,
            notMerge,
            replaceMerge,
            lazyUpdate,
            showLoading,
            loadingOption,
            shouldSetOption,
          };
          if (!shouldSetOption(prevProps, currentProps)) {
            return;
          }
        }

        // Check if option-related props changed
        const prevOptionProps = pick(prevProps, OPTION_PROPS);
        const currentOptionProps = pick(
          { option, notMerge, replaceMerge, lazyUpdate },
          OPTION_PROPS
        );

        if (!isEqual(prevOptionProps, currentOptionProps)) {
          const setOptionOpts: SetOptionOpts = {
            notMerge,
            lazyUpdate,
            replaceMerge,
          };
          chart.setOption(option, setOptionOpts);
        }
      }

      // Update loading state
      if (showLoading) {
        chart.showLoading("default", loadingOption);
      } else {
        chart.hideLoading();
      }

      // Rebind events if changed
      if (prevProps && !isEqual(prevProps.onEvents, onEvents)) {
        // Remove old event listeners
        Object.keys(prevProps.onEvents || {}).forEach((eventName) => {
          chart.off(eventName);
        });
        // Add new event listeners
        Object.entries(onEvents).forEach(([eventName, handler]) => {
          chart.on(eventName, (params: unknown) => handler(params, chart));
        });
      }

      // Update stored props
      prevPropsRef.current = {
        option,
        theme,
        style,
        className,
        autoResize,
        onChartReady,
        onEvents,
        opts,
        notMerge,
        replaceMerge,
        lazyUpdate,
        showLoading,
        loadingOption,
        shouldSetOption,
      };
    }, [
      option,
      notMerge,
      replaceMerge,
      lazyUpdate,
      showLoading,
      loadingOption,
      onEvents,
      shouldSetOption,
      // Include other deps for prevPropsRef update
      theme,
      style,
      className,
      autoResize,
      onChartReady,
      opts,
    ]);

    return (
      <div
        ref={chartRef}
        style={style}
        className={className ? `echarts-react ${className}` : "echarts-react"}
        {...divProps}
      />
    );
  }
);

EChartsReact.displayName = "EChartsReact";
