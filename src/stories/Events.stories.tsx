import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useRef } from "react";
import { EChartsReact } from "../ReactEcharts";
import type { EChartsReactRef } from "../types";

const meta: Meta<typeof EChartsReact> = {
  title: "Features/Event Handling",
  component: EChartsReact,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof EChartsReact>;

// Interactive click example
const ClickExample = () => {
  const [clickedData, setClickedData] = useState<string>("Click on a bar!");

  const option = {
    title: {
      text: "Click on bars",
    },
    tooltip: {},
    xAxis: {
      type: "category" as const,
      data: ["Apple", "Banana", "Orange", "Grape", "Mango"],
    },
    yAxis: {
      type: "value" as const,
    },
    series: [
      {
        type: "bar" as const,
        data: [120, 200, 150, 80, 170],
      },
    ],
  };

  return (
    <div>
      <EChartsReact
        option={option}
        style={{ height: 400, width: 600 }}
        onEvents={{
          click: (params: any) => {
            setClickedData(`Clicked: ${params.name} (${params.value})`);
          },
        }}
      />
      <p style={{ marginTop: 16, fontSize: 16 }}>{clickedData}</p>
    </div>
  );
};

export const ClickEvents: Story = {
  render: () => <ClickExample />,
  parameters: {
    docs: {
      description: {
        story: "Click on the bars to see event handling in action.",
      },
    },
  },
};

// Ref access example
const RefExample = () => {
  const chartRef = useRef<EChartsReactRef>(null);
  const [chartInfo, setChartInfo] = useState<string>("");

  const option = {
    title: {
      text: "Ref Access Example",
    },
    xAxis: {
      type: "category" as const,
      data: ["A", "B", "C", "D", "E"],
    },
    yAxis: {
      type: "value" as const,
    },
    series: [
      {
        type: "bar" as const,
        data: [10, 52, 200, 334, 390],
      },
    ],
  };

  const handleGetInstance = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const width = instance.getWidth();
      const height = instance.getHeight();
      setChartInfo(`Chart dimensions: ${width}x${height}px`);
    }
  };

  const handleExport = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      const dataURL = instance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#fff",
      });
      setChartInfo("Check console for data URL");
      console.log("Exported chart:", dataURL);
    }
  };

  const handleHighlight = () => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      instance.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 2,
      });
      setTimeout(() => {
        instance.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: 2,
        });
      }, 1000);
      setChartInfo('Highlighted "C" for 1 second');
    }
  };

  return (
    <div>
      <EChartsReact
        ref={chartRef}
        option={option}
        style={{ height: 400, width: 600 }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={handleGetInstance}>Get Instance Info</button>
        <button onClick={handleExport}>Export as PNG</button>
        <button onClick={handleHighlight}>Highlight "C"</button>
      </div>
      {chartInfo && <p style={{ marginTop: 8 }}>{chartInfo}</p>}
    </div>
  );
};

export const RefAccess: Story = {
  render: () => <RefExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Access the ECharts instance via ref to call methods like getDataURL(), dispatchAction(), etc.",
      },
    },
  },
};

// Multiple events example
const MultipleEventsExample = () => {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents((prev) => [...prev.slice(-4), event]);
  };

  const option = {
    title: {
      text: "Multiple Events",
    },
    legend: {
      data: ["Series A", "Series B"],
    },
    tooltip: {},
    xAxis: {
      type: "category" as const,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    yAxis: {
      type: "value" as const,
    },
    series: [
      {
        name: "Series A",
        type: "bar" as const,
        data: [120, 200, 150, 80, 70],
      },
      {
        name: "Series B",
        type: "bar" as const,
        data: [60, 80, 90, 120, 150],
      },
    ],
  };

  return (
    <div>
      <EChartsReact
        option={option}
        style={{ height: 400, width: 600 }}
        onEvents={{
          click: (params: any) => {
            addEvent(`click: ${params.seriesName} - ${params.name}`);
          },
          mouseover: (params: any) => {
            addEvent(`mouseover: ${params.seriesName} - ${params.name}`);
          },
          legendselectchanged: (params: any) => {
            const selected = Object.entries(params.selected)
              .filter(([_, v]) => v)
              .map(([k]) => k)
              .join(", ");
            addEvent(`legend: ${selected || "none"}`);
          },
        }}
      />
      <div
        style={{
          marginTop: 16,
          padding: 8,
          background: "#f5f5f5",
          borderRadius: 4,
          minHeight: 100,
        }}
      >
        <strong>Event Log:</strong>
        {events.map((event, i) => (
          <div key={i} style={{ fontSize: 12, marginTop: 4 }}>
            {event}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MultipleEvents: Story = {
  render: () => <MultipleEventsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Handle multiple events like click, mouseover, and legendselectchanged.",
      },
    },
  },
};
