import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useRef, useState } from "react";
import { EChartsReact } from "../ReactEcharts";
import type { EChartsReactRef } from "../types";

const meta: Meta = {
  title: "Features/Advanced",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Examples of ECharts' non-obvious capabilities — dataset transforms, interactive zoom, real-time streaming, custom tooltips, cross-filter linking, and big-data progressive rendering.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ---- 1. Dataset with transform ----
const DatasetWithTransformExample = () => {
  const option = {
    title: { text: "Dataset + Transform" },
    tooltip: {},
    legend: { bottom: 0 },
    dataset: [
      {
        source: [
          ["Region", "Q1", "Q2"],
          ["Americas", 820, 932],
          ["EMEA", 700, 820],
          ["APAC", 540, 680],
          ["Other", 230, 180],
        ],
      },
      {
        transform: {
          type: "filter" as const,
          config: { dimension: "Q1", gte: 500 },
        },
      },
    ],
    xAxis: { type: "category" as const },
    yAxis: {},
    series: [
      { type: "bar" as const, datasetIndex: 1 },
      { type: "bar" as const, datasetIndex: 1, encode: { x: "Region", y: "Q2" } },
    ],
  };

  return <EChartsReact option={option} style={{ height: 400, width: 600 }} />;
};

export const DatasetWithTransform: Story = {
  render: () => <DatasetWithTransformExample />,
  parameters: {
    docs: {
      description: {
        story:
          "One dataset drives two series; a `transform` filters rows with Q1 >= 500 inline. Good for ad-hoc slicing without re-shaping data upstream.",
      },
    },
  },
};

// ---- 2. DataZoom ----
const DataZoomExample = () => {
  const days = Array.from({ length: 365 }, (_, i) => `Day ${i + 1}`);
  const series = days.map((_, i) => Math.round(500 + 200 * Math.sin(i / 20) + Math.random() * 80));
  const option = {
    title: { text: "Daily Metric — 365 days" },
    tooltip: { trigger: "axis" as const },
    xAxis: { type: "category" as const, data: days, boundaryGap: false },
    yAxis: { type: "value" as const },
    dataZoom: [
      { type: "slider" as const, start: 0, end: 10 },
      { type: "inside" as const, start: 0, end: 10 },
    ],
    series: [{ type: "line" as const, data: series, smooth: true, showSymbol: false }],
  };

  return <EChartsReact option={option} style={{ height: 400, width: 700 }} />;
};

export const DataZoom: Story = {
  render: () => <DataZoomExample />,
  parameters: {
    docs: {
      description: {
        story:
          "365-day series with both `slider` (drag handles) and `inside` (mouse wheel / touch pinch) zoom. Essential for any time-series view where you want both overview and drill-down in one chart.",
      },
    },
  },
};

// ---- 3. Real-time streaming ----
const RealTimeStreamingExample = () => {
  const chartRef = useRef<EChartsReactRef>(null);
  const [data, setData] = useState<Array<{ value: [number, number] }>>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      value: [Date.now() - (60 - i) * 1000, 50 + Math.random() * 20] as [number, number],
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const now = Date.now();
        const next = [...prev.slice(1), {
          value: [now, 50 + Math.random() * 20] as [number, number],
        }];
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const option = {
    title: { text: "Live Metric (updates every 1s)" },
    tooltip: { trigger: "axis" as const },
    xAxis: { type: "time" as const, splitLine: { show: false } },
    yAxis: { type: "value" as const, min: 40, max: 80, boundaryGap: [0, "100%"] },
    series: [
      {
        type: "line" as const,
        data: data as unknown as number[][],
        showSymbol: false,
        smooth: true,
        areaStyle: {},
      },
    ],
    animation: false,
  };

  return <EChartsReact ref={chartRef} option={option} style={{ height: 400, width: 700 }} />;
};

export const RealTimeStreaming: Story = {
  render: () => <RealTimeStreamingExample />,
  parameters: {
    docs: {
      description: {
        story:
          "60-point rolling window updated every second via `setInterval` + React state. The interval is cleaned up on unmount — navigate between stories and check devtools for no lingering timers.",
      },
    },
  },
};

// ---- 4. Custom tooltip formatter ----
const TooltipFormatterExample = () => {
  const option = {
    title: { text: "Custom Tooltip" },
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: unknown) => {
        const items = params as Array<{
          seriesName?: string;
          name?: string;
          value?: number;
          color?: string;
        }>;
        const header = items[0]?.name ?? "";
        const rows = items
          .map(
            (p) =>
              `<div style="display:flex;justify-content:space-between;gap:24px">
                <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}</span>
                <strong>$${(p.value ?? 0).toLocaleString()}</strong>
              </div>`
          )
          .join("");
        return `<div style="font-family:system-ui;padding:4px 2px;min-width:220px">
          <div style="color:#666;margin-bottom:6px">${header}</div>
          ${rows}
        </div>`;
      },
    },
    legend: { bottom: 0 },
    xAxis: { type: "category" as const, data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    yAxis: { type: "value" as const },
    series: [
      { name: "Revenue", type: "line" as const, data: [12400, 15200, 14800, 17100, 19300, 22100] },
      { name: "Cost", type: "line" as const, data: [9200, 10400, 10800, 11900, 12500, 13800] },
    ],
  };

  return <EChartsReact option={option} style={{ height: 400, width: 700 }} />;
};

export const TooltipFormatter: Story = {
  render: () => <TooltipFormatterExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Custom HTML tooltip — here formatted numbers with color swatches. The `formatter` receives all series params for the hovered x-axis position.",
      },
    },
  },
};

// ---- 5. Linked charts via dispatchAction ----
const LinkedChartsExample = () => {
  const chartARef = useRef<EChartsReactRef>(null);
  const chartBRef = useRef<EChartsReactRef>(null);

  const optionA = {
    title: { text: "Click a bar →" },
    tooltip: {},
    xAxis: { type: "category" as const, data: ["Americas", "EMEA", "APAC", "Other"] },
    yAxis: { type: "value" as const },
    series: [
      {
        type: "bar" as const,
        data: [820, 700, 540, 230],
        itemStyle: { color: "#5470c6" },
      },
    ],
  };

  const optionB = {
    title: { text: "… highlights the matching slice" },
    tooltip: {},
    legend: { bottom: 0 },
    series: [
      {
        type: "pie" as const,
        radius: "60%",
        data: [
          { value: 820, name: "Americas" },
          { value: 700, name: "EMEA" },
          { value: 540, name: "APAC" },
          { value: 230, name: "Other" },
        ],
      },
    ],
  };

  const handleClickA = (params: unknown) => {
    const p = params as { name: string };
    const b = chartBRef.current?.getEchartsInstance();
    if (b) {
      b.dispatchAction({ type: "downplay", seriesIndex: 0 });
      b.dispatchAction({ type: "highlight", seriesIndex: 0, name: p.name });
    }
  };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <EChartsReact
        ref={chartARef}
        option={optionA}
        onEvents={{ click: handleClickA }}
        style={{ height: 400, width: 400 }}
      />
      <EChartsReact ref={chartBRef} option={optionB} style={{ height: 400, width: 400 }} />
    </div>
  );
};

export const LinkedCharts: Story = {
  render: () => <LinkedChartsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Click a bar on the left; the right pie chart highlights the matching slice via `dispatchAction({ type: 'highlight', name })`. Same pattern applies to cross-filter dashboards.",
      },
    },
  },
};

// ---- 6. Progressive rendering ----
const ProgressiveRenderingExample = () => {
  // 50k scatter points — demonstrates ECharts' progressive rendering.
  const points = React.useMemo(
    () =>
      Array.from({ length: 50000 }, () => [
        Math.random() * 1000,
        Math.random() * 1000,
      ]),
    []
  );
  const option = {
    title: { text: "50,000 scatter points (progressive)" },
    tooltip: { show: false },
    xAxis: { type: "value" as const },
    yAxis: { type: "value" as const },
    series: [
      {
        type: "scatter" as const,
        data: points,
        symbolSize: 3,
        progressive: 2000,
        progressiveThreshold: 5000,
        large: true,
        largeThreshold: 2000,
      },
    ],
  };

  return <EChartsReact option={option} style={{ height: 400, width: 700 }} />;
};

export const ProgressiveRendering: Story = {
  render: () => <ProgressiveRenderingExample />,
  parameters: {
    docs: {
      description: {
        story:
          "50,000 scatter points with `progressive: 2000` + `large: true`. ECharts renders in chunks to keep the main thread responsive. For bigger datasets, increase `progressive` and consider disabling the tooltip.",
      },
    },
  },
};
