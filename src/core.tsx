import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { EChartsType, SetOptionOpts } from "echarts/core";
import isEqual from "fast-deep-equal";
import type {
  EChartsCoreProps,
  EChartsReactRef,
  EChartsBaseProps,
} from "./types";

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
 * EChartsCore - A tree-shakeable React wrapper for Apache ECharts.
 *
 * This component requires an echarts instance to be passed as a prop,
 * allowing you to import only the charts and components you need.
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
 * import EChartsCore from 'react-echarts-library/core';
 * import * as echarts from 'echarts/core';
 * import { BarChart } from 'echarts/charts';
 * import { GridComponent } from 'echarts/components';
 * import { CanvasRenderer } from 'echarts/renderers';
 *
 * echarts.use([BarChart, GridComponent, CanvasRenderer]);
 *
 * <EChartsCore echarts={echarts} option={option} />
 * ```
 */
export const EChartsCore = forwardRef<EChartsReactRef, EChartsCoreProps>(
  (
    {
      echarts,
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
    const prevPropsRef = useRef<EChartsBaseProps | null>(null);
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
    }, [echarts, theme, opts?.renderer, opts?.locale]);

    // Update chart option when props change
    useEffect(() => {
      const chart = chartInstance.current;
      if (!chart || chart.isDisposed()) return;

      const prevProps = prevPropsRef.current;

      // Check if we should update option
      if (prevProps) {
        // Use custom shouldSetOption if provided
        if (shouldSetOption) {
          const currentProps: EChartsBaseProps = {
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

EChartsCore.displayName = "EChartsCore";
export default EChartsCore;
