"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import type { EChartsType, SetOptionOpts } from "echarts/core";
import isEqual from "fast-deep-equal";
import type { EChartsBaseProps, EChartsCore } from "./types";

/**
 * Options accepted by the useECharts hook. Mirrors EChartsBaseProps but
 * without the container-level props (style, className, HTML attrs) — the
 * consumer owns the <div>, so those belong on the consumer's markup.
 */
export type UseEChartsOptions = Omit<
  EChartsBaseProps,
  "style" | "className"
>;

/**
 * Handle returned by useECharts. `containerRef` is a callback ref you
 * attach to your own <div>; `getInstance` returns the underlying ECharts
 * instance (or null before mount / after unmount).
 */
export interface UseEChartsReturn {
  containerRef: (node: HTMLDivElement | null) => void;
  getInstance: () => EChartsType | null;
}

const OPTION_PROPS = [
  "option",
  "notMerge",
  "replaceMerge",
  "lazyUpdate",
] as const;

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
 * React hook that provides the same chart lifecycle as <EChartsReact>
 * but lets the consumer own the container markup. Pass an echarts
 * instance (so tree-shaking stays under the consumer's control) and the
 * same options you'd pass to the component; attach the returned
 * `containerRef` to your <div>.
 *
 * @example
 * ```tsx
 * import { useECharts } from 'react-echarts-library/core';
 * import * as echarts from 'echarts/core';
 * import { BarChart } from 'echarts/charts';
 * import { GridComponent, TooltipComponent } from 'echarts/components';
 * import { CanvasRenderer } from 'echarts/renderers';
 *
 * echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);
 *
 * function MyChart() {
 *   const { containerRef } = useECharts(echarts, {
 *     option: {
 *       xAxis: { type: 'category', data: ['A', 'B', 'C'] },
 *       yAxis: { type: 'value' },
 *       series: [{ type: 'bar', data: [10, 20, 30] }],
 *     },
 *   });
 *   return <div ref={containerRef} style={{ height: 320 }} />;
 * }
 * ```
 */
export function useECharts(
  echarts: EChartsCore,
  options: UseEChartsOptions
): UseEChartsReturn {
  const {
    option,
    theme,
    opts,
    onEvents = {},
    notMerge = false,
    replaceMerge,
    lazyUpdate = false,
    showLoading = false,
    loadingOption,
    shouldSetOption,
    autoResize = true,
    onChartReady,
  } = options;

  const instanceRef = useRef<EChartsType | null>(null);
  const prevPropsRef = useRef<EChartsBaseProps | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    setContainer(node);
  }, []);

  const getInstance = useCallback(() => instanceRef.current, []);

  // Init effect: runs on container mount, theme change, or renderer/locale change.
  useEffect(() => {
    if (!container) return;

    const initOpts = {
      renderer: opts?.renderer ?? "canvas",
      devicePixelRatio: opts?.devicePixelRatio,
      width: opts?.width,
      height: opts?.height,
      locale: opts?.locale,
      useDirtyRect: opts?.useDirtyRect,
    };

    const chart = echarts.init(container, theme, initOpts);
    instanceRef.current = chart;

    const setOptionOpts: SetOptionOpts = { notMerge, lazyUpdate, replaceMerge };
    chart.setOption(option, setOptionOpts);

    Object.entries(onEvents).forEach(([eventName, handler]) => {
      chart.on(eventName, (params: unknown) => handler(params, chart));
    });

    if (showLoading) {
      chart.showLoading("default", loadingOption);
    }

    if (onChartReady) {
      onChartReady(chart);
    }

    if (autoResize) {
      resizeObserverRef.current = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (chart && !chart.isDisposed()) {
            chart.resize();
          }
        });
      });
      resizeObserverRef.current.observe(container);
    }

    prevPropsRef.current = {
      option,
      theme,
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
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
      instanceRef.current = null;
    };
    // Intentionally narrow deps — other prop changes are handled by the update effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, echarts, theme, opts?.renderer, opts?.locale]);

  // Update effect: propagates prop changes without re-initializing.
  useEffect(() => {
    const chart = instanceRef.current;
    if (!chart || chart.isDisposed()) return;

    const prevProps = prevPropsRef.current;
    if (prevProps) {
      if (shouldSetOption) {
        const currentProps: EChartsBaseProps = {
          option,
          theme,
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
          // skip the setOption below
        } else {
          chart.setOption(option, { notMerge, lazyUpdate, replaceMerge } as SetOptionOpts);
        }
      } else {
        const prevOptionProps = pick(prevProps, OPTION_PROPS);
        const currentOptionProps = pick(
          { option, notMerge, replaceMerge, lazyUpdate },
          OPTION_PROPS
        );
        if (!isEqual(prevOptionProps, currentOptionProps)) {
          chart.setOption(option, { notMerge, lazyUpdate, replaceMerge } as SetOptionOpts);
        }
      }
    }

    if (showLoading) {
      chart.showLoading("default", loadingOption);
    } else {
      chart.hideLoading();
    }

    if (prevProps && !isEqual(prevProps.onEvents, onEvents)) {
      Object.keys(prevProps.onEvents ?? {}).forEach((eventName) => {
        chart.off(eventName);
      });
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chart.on(eventName, (params: unknown) => handler(params, chart));
      });
    }

    prevPropsRef.current = {
      option,
      theme,
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
    theme,
    autoResize,
    onChartReady,
    opts,
  ]);

  return { containerRef, getInstance };
}
