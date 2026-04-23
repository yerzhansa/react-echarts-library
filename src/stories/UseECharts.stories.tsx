import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { useECharts } from "../useECharts";

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

const meta: Meta = {
  title: "Features/useECharts Hook",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The `useECharts` hook provides the same chart lifecycle as the `<EChartsReact>` component, but lets you own the container markup. Useful when you want to wrap the chart in a card, position a toolbar alongside it, or place a skeleton during loading.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const barOption = {
  title: { text: "useECharts Basic Example" },
  tooltip: { trigger: "axis" as const },
  xAxis: { type: "category" as const, data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  yAxis: { type: "value" as const },
  series: [{ type: "bar" as const, data: [120, 200, 150, 80, 70] }],
};

const BasicExample = () => {
  const { containerRef } = useECharts(echarts, { option: barOption });
  return <div ref={containerRef} style={{ height: 400, width: 600 }} />;
};

export const BasicHookUsage: Story = {
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Minimal usage: pass an echarts instance and an option, attach the returned `containerRef` to your own div. No component wrapper required.",
      },
    },
  },
};

const lineOption = {
  title: { text: "Revenue" },
  tooltip: { trigger: "axis" as const },
  xAxis: { type: "category" as const, data: ["Q1", "Q2", "Q3", "Q4"] },
  yAxis: { type: "value" as const },
  series: [
    { type: "line" as const, data: [820, 932, 1290, 1330], smooth: true },
  ],
};

const CardExample = () => {
  const { containerRef, getInstance } = useECharts(echarts, { option: lineOption });

  const handleReset = () => {
    getInstance()?.dispatchAction({ type: "restore" });
  };

  const handleExport = () => {
    const url = getInstance()?.getDataURL({ type: "png", pixelRatio: 2 });
    if (url) {
      const w = window.open("");
      w?.document.write(`<img src="${url}" />`);
    }
  };

  return (
    <section
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 16,
        width: 600,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        background: "#fff",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <strong>Quarterly Revenue</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleExport}>Export</button>
        </div>
      </header>
      <div ref={containerRef} style={{ height: 320 }} />
    </section>
  );
};

export const HookWithCustomContainer: Story = {
  render: () => <CardExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A realistic use case: the chart lives inside a styled card alongside its own toolbar. Because the consumer owns the div, the toolbar and the chart share layout naturally — no wrapper hacks required. The `getInstance` return value gives access to the underlying ECharts instance for actions like export or dispatchAction.",
      },
    },
  },
};
