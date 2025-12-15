import React, { useState } from "react";
import { EChartsReact } from "../src";
import type { EChartsOption } from "echarts";

/**
 * Example demonstrating the renderer selection feature
 * - opts.renderer: 'canvas' (default) or 'svg'
 * - SVG is better for: printing, scaling, fewer elements
 * - Canvas is better for: large datasets, animations, performance
 */
const SVGRendererExample = () => {
  const [renderer, setRenderer] = useState<"canvas" | "svg">("svg");

  const option: EChartsOption = {
    title: {
      text: `Rendered with ${renderer.toUpperCase()}`,
      subtext: "Try switching renderers below",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "Traffic Source",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>SVG vs Canvas Renderer</h2>
      <p>
        Uses <code>opts</code> prop with <code>renderer</code> option
      </p>
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 16 }}>
          <input
            type="radio"
            name="renderer"
            value="canvas"
            checked={renderer === "canvas"}
            onChange={() => setRenderer("canvas")}
          />{" "}
          Canvas (better for performance)
        </label>
        <label>
          <input
            type="radio"
            name="renderer"
            value="svg"
            checked={renderer === "svg"}
            onChange={() => setRenderer("svg")}
          />{" "}
          SVG (better for printing/scaling)
        </label>
      </div>
      <EChartsReact
        key={renderer} // Force re-mount when renderer changes
        option={option}
        style={{ height: 400, width: "100%" }}
        opts={{
          renderer: renderer,
          devicePixelRatio: 2, // High-DPI support
        }}
        data-testid="renderer-chart"
        aria-label={`Pie chart rendered with ${renderer}`}
      />
      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Inspect element to see {renderer === "svg" ? "<svg>" : "<canvas>"} tag
      </p>
    </div>
  );
};

export default SVGRendererExample;
