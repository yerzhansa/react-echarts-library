import React, { useState } from "react";
import EChartsReact from "react-echarts-library";
import type { EChartOption } from "echarts";

const LineChartExample = () => {
  const option: EChartOption = {
    title: {
      text: "Basic Line Chart",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Line Chart</h2>
      <EChartsReact
        option={option}
        style={{ height: 400, width: "100%" }}
        className="my-chart"
      />
    </div>
  );
};

const BarChartExample = () => {
  const [clickedData, setClickedData] = useState<string | null>(null);

  const option: EChartOption = {
    title: {
      text: "Bar Chart with Events",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
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
        data: [120, 200, 150, 80, 70, 110],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };

  const onEvents = {
    click: (params: any, chart: any) => {
      setClickedData(`Clicked on ${params.name}: ${params.value}`);
    },
  };

  return (
    <div className="chart-container">
      <h2>Bar Chart with Click Event</h2>
      <EChartsReact
        option={option}
        style={{ height: 400, width: "100%" }}
        onEvents={onEvents}
      />
      {clickedData && <div className="clicked-info">{clickedData}</div>}
    </div>
  );
};

const PieChartExample = () => {
  const option: EChartOption = {
    title: {
      text: "Pie Chart",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Pie Chart</h2>
      <EChartsReact option={option} style={{ height: 400, width: "100%" }} />
    </div>
  );
};

const ThemedChartExample = () => {
  const option: EChartOption = {
    title: {
      text: "Themed Chart with Instance Access",
    },
    xAxis: {
      type: "category",
      data: ["Q1", "Q2", "Q3", "Q4"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [820, 932, 901, 934],
        type: "line",
        smooth: true,
      },
    ],
  };

  const handleChartReady = (chart: any) => {
    console.log("Chart instance is ready:", chart);
  };

  return (
    <div className="chart-container">
      <h2>Themed Chart with Instance Access</h2>
      <EChartsReact
        option={option}
        theme="dark"
        style={{ height: 400, width: "100%", background: "#100C2A" }}
        onChartReady={handleChartReady}
      />
    </div>
  );
};

const ResponsiveChartExample = () => {
  const option: EChartOption = {
    title: {
      text: "Responsive Chart (Resize Window)",
    },
    grid: {
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "Category A",
        "Category B",
        "Category C",
        "Category D",
        "Category E",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "scatter",
        data: [
          [0, 120],
          [1, 200],
          [2, 150],
          [3, 80],
          [4, 170],
        ],
        symbolSize: 20,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Responsive Chart (Resize Window)</h2>
      <EChartsReact
        option={option}
        style={{ height: 400, width: "100%" }}
        autoResize={true}
      />
    </div>
  );
};

const ReactEChartsExample = () => {
  return (
    <div className="echarts-examples">
      <h1>ECharts React Library Examples</h1>
      <p>
        This page demonstrates various ways to use the ECharts React library
      </p>

      <LineChartExample />
      <BarChartExample />
      <PieChartExample />
      <ThemedChartExample />
      <ResponsiveChartExample />
    </div>
  );
};

export default ReactEChartsExample;
