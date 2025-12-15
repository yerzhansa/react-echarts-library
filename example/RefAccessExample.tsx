import React, { useRef, useState } from "react";
import { EChartsReact, EChartsReactRef } from "../src";
import type { EChartsOption } from "echarts";

/**
 * Example demonstrating ref access to the ECharts instance
 * - useRef<EChartsReactRef> to get chart reference
 * - getEchartsInstance() to access the raw ECharts API
 * - Useful for: exporting images, dispatching actions, custom methods
 */
const RefAccessExample = () => {
  const chartRef = useRef<EChartsReactRef>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [chartInfo, setChartInfo] = useState<string>("");

  const option: EChartsOption = {
    title: {
      text: "Ref Access Demo",
      subtext: "Use buttons to interact with chart instance",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Revenue",
        type: "line",
        data: [820, 932, 901, 934, 1290, 1330],
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
      },
      {
        name: "Expenses",
        type: "line",
        data: [620, 732, 701, 734, 890, 930],
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
      },
    ],
  };

  // Export chart as PNG image
  const handleExportImage = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const url = instance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      setImageUrl(url);
    }
  };

  // Get chart dimensions
  const handleGetInfo = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const width = instance.getWidth();
      const height = instance.getHeight();
      const opt = instance.getOption();
      setChartInfo(
        `Width: ${width}px, Height: ${height}px, Series count: ${(opt.series as any[])?.length || 0}`
      );
    }
  };

  // Dispatch highlight action
  const handleHighlight = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      instance.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 4,
      });
    }
  };

  // Dispatch downplay action
  const handleDownplay = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      instance.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: 4,
      });
    }
  };

  // Resize chart programmatically
  const handleResize = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      instance.resize();
      setChartInfo("Chart resized!");
    }
  };

  return (
    <div className="chart-container">
      <h2>Ref Access Example</h2>
      <p>
        Uses <code>useRef&lt;EChartsReactRef&gt;</code> and{" "}
        <code>getEchartsInstance()</code>
      </p>

      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={handleExportImage}>Export as PNG</button>
        <button onClick={handleGetInfo}>Get Chart Info</button>
        <button onClick={handleHighlight}>Highlight May</button>
        <button onClick={handleDownplay}>Clear Highlight</button>
        <button onClick={handleResize}>Resize Chart</button>
      </div>

      {chartInfo && (
        <div
          style={{
            padding: 8,
            background: "#f5f5f5",
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          {chartInfo}
        </div>
      )}

      <EChartsReact
        ref={chartRef}
        option={option}
        style={{ height: 400, width: "100%" }}
      />

      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <h4>Exported Image:</h4>
          <img
            src={imageUrl}
            alt="Exported chart"
            style={{ maxWidth: "100%", border: "1px solid #ddd" }}
          />
          <p>
            <a href={imageUrl} download="chart.png">
              Download PNG
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default RefAccessExample;
