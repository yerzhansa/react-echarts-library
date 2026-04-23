import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef, useState, useEffect } from "react";
import { EChartsReact } from "../ReactEcharts";
import type { EChartsReactRef } from "../types";
import { exportToPNG, exportToSVG } from "../utils/export";
import { useChartTheme } from "../utils/useChartTheme";

const meta: Meta = {
  title: "Features/Utilities",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Helper utilities: `exportToPNG` / `exportToSVG` for image export with optional auto-download, and `useChartTheme` for automatic OS dark-mode sync.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const exportOption = {
  title: { text: "Exportable Chart" },
  tooltip: { trigger: "axis" as const },
  xAxis: { type: "category" as const, data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  yAxis: { type: "value" as const },
  series: [{ type: "bar" as const, data: [120, 200, 150, 80, 70] }],
};

const ExportExample = () => {
  const chartRef = useRef<EChartsReactRef>(null);
  const [status, setStatus] = useState<string>("");

  const handleExportPNG = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;
    exportToPNG(chart, { filename: "chart.png", pixelRatio: 2 });
    setStatus("Downloaded chart.png");
  };

  const handleExportSVG = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;
    exportToSVG(chart, { filename: "chart.svg" });
    setStatus("Downloaded chart.svg");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={handleExportPNG}>Export as PNG</button>
        <button onClick={handleExportSVG}>Export as SVG</button>
        {status && <span>{status}</span>}
      </div>
      <EChartsReact
        ref={chartRef}
        option={exportOption}
        style={{ height: 400, width: 600 }}
      />
    </div>
  );
};

export const ExportAsImage: Story = {
  render: () => <ExportExample />,
  parameters: {
    docs: {
      description: {
        story:
          "`exportToPNG(chart, { filename })` and `exportToSVG(chart, { filename })` return the data URL and trigger a browser download when `filename` is provided. Omit `filename` to handle the URL yourself (embed in an `<img>`, upload to a server, etc.).",
      },
    },
  },
};

const themedOption = {
  title: { text: "Dark-mode Synced Chart" },
  tooltip: { trigger: "axis" as const },
  xAxis: { type: "category" as const, data: ["Q1", "Q2", "Q3", "Q4"] },
  yAxis: { type: "value" as const },
  series: [
    { type: "line" as const, data: [820, 932, 1290, 1330], smooth: true },
  ],
};

const DarkModeSyncExample = () => {
  const theme = useChartTheme();
  const [override, setOverride] = useState<"auto" | "light" | "dark">("auto");
  const activeTheme = useChartTheme(override === "auto" ? undefined : override);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <span>Current: <strong>{activeTheme}</strong></span>
        <span style={{ color: "#666", fontSize: 12 }}>(system: {theme})</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button onClick={() => setOverride("auto")} disabled={override === "auto"}>Auto</button>
          <button onClick={() => setOverride("light")} disabled={override === "light"}>Force Light</button>
          <button onClick={() => setOverride("dark")} disabled={override === "dark"}>Force Dark</button>
        </div>
      </div>
      <EChartsReact
        option={themedOption}
        theme={activeTheme}
        style={{ height: 400, width: 600 }}
      />
    </div>
  );
};

export const DarkModeSync: Story = {
  render: () => <DarkModeSyncExample />,
  parameters: {
    docs: {
      description: {
        story:
          "`useChartTheme()` returns `'light'` or `'dark'` synced to `prefers-color-scheme`. Pass an explicit override to force a value — useful when your app already has its own theme state and you want to pipe it through. Try toggling OS dark mode to watch the chart re-theme automatically.",
      },
    },
  },
};
