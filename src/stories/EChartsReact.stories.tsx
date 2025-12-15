import type { Meta, StoryObj } from "@storybook/react";
import { EChartsReact } from "../ReactEcharts";

const meta: Meta<typeof EChartsReact> = {
  title: "Components/EChartsReact",
  component: EChartsReact,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    theme: {
      control: "select",
      options: [undefined, "dark"],
      description: "Chart theme",
    },
    showLoading: {
      control: "boolean",
      description: "Show loading animation",
    },
    autoResize: {
      control: "boolean",
      description: "Auto-resize on container change",
    },
    notMerge: {
      control: "boolean",
      description: "Replace option instead of merge",
    },
    lazyUpdate: {
      control: "boolean",
      description: "Defer chart update",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EChartsReact>;

const lineChartOption = {
  title: {
    text: "Line Chart Example",
  },
  tooltip: {
    trigger: "axis" as const,
  },
  xAxis: {
    type: "category" as const,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value" as const,
  },
  series: [
    {
      name: "Sales",
      type: "line" as const,
      data: [150, 230, 224, 218, 135, 147, 260],
      smooth: true,
    },
  ],
};

const barChartOption = {
  title: {
    text: "Bar Chart Example",
  },
  tooltip: {
    trigger: "axis" as const,
  },
  xAxis: {
    type: "category" as const,
    data: ["Product A", "Product B", "Product C", "Product D", "Product E"],
  },
  yAxis: {
    type: "value" as const,
  },
  series: [
    {
      name: "Sales",
      type: "bar" as const,
      data: [120, 200, 150, 80, 70],
      itemStyle: {
        color: "#5470c6",
      },
    },
  ],
};

const pieChartOption = {
  title: {
    text: "Pie Chart Example",
    left: "center",
  },
  tooltip: {
    trigger: "item" as const,
  },
  legend: {
    orient: "vertical" as const,
    left: "left",
  },
  series: [
    {
      name: "Access From",
      type: "pie" as const,
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

export const LineChart: Story = {
  args: {
    option: lineChartOption,
    style: { height: 400, width: 600 },
  },
};

export const BarChart: Story = {
  args: {
    option: barChartOption,
    style: { height: 400, width: 600 },
  },
};

export const PieChart: Story = {
  args: {
    option: pieChartOption,
    style: { height: 400, width: 600 },
  },
};

export const DarkTheme: Story = {
  args: {
    option: lineChartOption,
    theme: "dark",
    style: { height: 400, width: 600 },
  },
};

export const WithLoading: Story = {
  args: {
    option: lineChartOption,
    showLoading: true,
    loadingOption: {
      text: "Loading...",
      color: "#5470c6",
      maskColor: "rgba(255, 255, 255, 0.8)",
    },
    style: { height: 400, width: 600 },
  },
};

export const SVGRenderer: Story = {
  args: {
    option: lineChartOption,
    opts: { renderer: "svg" },
    style: { height: 400, width: 600 },
  },
  parameters: {
    docs: {
      description: {
        story: "Using SVG renderer instead of Canvas for better scalability.",
      },
    },
  },
};
