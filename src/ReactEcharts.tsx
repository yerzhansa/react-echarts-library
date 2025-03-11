import React, { useRef, useEffect, useMemo } from "react";
import * as echarts from "echarts/core";
import type { EChartsType } from "echarts/core";
import { EChartsOption } from "echarts";

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

import { CanvasRenderer } from "echarts/renderers";

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
]);

interface EChartsReactProps {
  option: EChartsOption;
  theme?: string | object;
  style?: React.CSSProperties;
  className?: string;
  autoResize?: boolean;
  onChartReady?: (chart: EChartsType) => void;
  onEvents?: Record<string, (params: unknown, chart: EChartsType) => void>;
}

export const EChartsReact: React.FC<EChartsReactProps> = ({
  option,
  theme,
  style = { height: 300 },
  className = "",
  autoResize = true,
  onChartReady,
  onEvents = {},
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current, theme, {
      renderer: "canvas",
    });

    chartInstance.current = chart;

    chart.setOption(option);

    Object.entries(onEvents).forEach(([eventName, handler]) => {
      chart.on(eventName, (params: unknown) => handler(params, chart));
    });

    if (onChartReady) {
      onChartReady(chart);
    }

    const resizeHandler = () => {
      chart.resize();
    };

    if (autoResize) {
      window.addEventListener("resize", resizeHandler);
    }

    return () => {
      if (autoResize) {
        window.removeEventListener("resize", resizeHandler);
      }

      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }

      chartInstance.current = null;
    };
  }, [theme, option, onEvents, onChartReady, autoResize]);

  return (
    <div
      ref={chartRef}
      style={style}
      className={`echarts-react ${className}`}
    />
  );
};
