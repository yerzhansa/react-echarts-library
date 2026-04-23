import React, { forwardRef, useImperativeHandle } from "react";
import { useECharts } from "./useECharts";
import type { EChartsCoreProps, EChartsReactRef } from "./types";

/**
 * EChartsCore - A tree-shakeable React wrapper for Apache ECharts.
 *
 * Thin adapter around the `useECharts` hook: the hook supplies the full
 * chart lifecycle (init, option updates, event binding, resize, teardown)
 * and this component renders the container div around it.
 *
 * For maximum control over the container markup — e.g., to nest the chart
 * inside a styled card or position a skeleton alongside it — use
 * `useECharts` directly.
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
      onEvents,
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
    const { containerRef, getInstance } = useECharts(echarts, {
      option,
      theme,
      opts,
      onEvents,
      notMerge,
      replaceMerge,
      lazyUpdate,
      showLoading,
      loadingOption,
      shouldSetOption,
      autoResize,
      onChartReady,
    });

    useImperativeHandle(
      ref,
      () => ({
        getEchartsInstance: getInstance,
      }),
      [getInstance]
    );

    return (
      <div
        ref={containerRef}
        style={style}
        className={className ? `echarts-react ${className}` : "echarts-react"}
        {...divProps}
      />
    );
  }
);

EChartsCore.displayName = "EChartsCore";
export default EChartsCore;
