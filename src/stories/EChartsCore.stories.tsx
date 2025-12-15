import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

// Tree-shakeable imports - demonstrating how to use EChartsCore
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { EChartsCore } from "../core";
import type { EChartsCoreProps } from "../types";

// Register only what we need for these stories
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

// Wrapper component that includes echarts
const EChartsCoreWrapper = (props: Omit<EChartsCoreProps, "echarts">) => {
  return <EChartsCore echarts={echarts} {...props} />;
};

const meta: Meta<typeof EChartsCoreWrapper> = {
  title: "Components/EChartsCore (Tree-Shakeable)",
  component: EChartsCoreWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
EChartsCore is the tree-shakeable version of the component.
It requires you to pass an echarts instance, allowing you to import only the charts and components you need.

**Usage:**
\`\`\`tsx
import EChartsCore from 'react-echarts-library/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only what you need
echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

<EChartsCore echarts={echarts} option={option} />
\`\`\`

This can significantly reduce your bundle size if you only need a few chart types.
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: "select",
      options: [undefined, "dark"],
    },
    showLoading: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EChartsCoreWrapper>;

const simpleBarOption = {
  title: {
    text: "Simple Bar Chart",
    subtext: "Using tree-shaking",
  },
  tooltip: {
    trigger: "axis" as const,
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
      name: "Value",
      type: "bar" as const,
      data: [120, 200, 150, 80, 70],
    },
  ],
};

const simpleLineOption = {
  title: {
    text: "Simple Line Chart",
    subtext: "Minimal bundle",
  },
  tooltip: {
    trigger: "axis" as const,
  },
  xAxis: {
    type: "category" as const,
    data: ["Jan", "Feb", "Mar", "Apr", "May"],
  },
  yAxis: {
    type: "value" as const,
  },
  series: [
    {
      name: "Revenue",
      type: "line" as const,
      data: [820, 932, 901, 934, 1290],
      smooth: true,
    },
  ],
};

export const TreeShakeableBar: Story = {
  args: {
    option: simpleBarOption,
    style: { height: 400, width: 600 },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A bar chart using tree-shaking - only BarChart, GridComponent, TooltipComponent, TitleComponent, and CanvasRenderer are included.",
      },
    },
  },
};

export const TreeShakeableLine: Story = {
  args: {
    option: simpleLineOption,
    style: { height: 400, width: 600 },
  },
  parameters: {
    docs: {
      description: {
        story:
          "A line chart using tree-shaking - only LineChart and necessary components are included.",
      },
    },
  },
};

export const BundleSizeComparison: Story = {
  args: {
    option: {
      title: {
        text: "Bundle Size Comparison",
        subtext: "Tree-shaking benefits",
      },
      tooltip: {
        trigger: "axis" as const,
      },
      xAxis: {
        type: "category" as const,
        data: ["Full Bundle", "Tree-Shaken"],
      },
      yAxis: {
        type: "value" as const,
        name: "Size (KB)",
      },
      series: [
        {
          name: "Bundle Size",
          type: "bar" as const,
          data: [
            { value: 1000, itemStyle: { color: "#ee6666" } },
            { value: 150, itemStyle: { color: "#91cc75" } },
          ],
          label: {
            show: true,
            position: "top",
            formatter: "{c} KB",
          },
        },
      ],
    },
    style: { height: 400, width: 600 },
  },
  parameters: {
    docs: {
      description: {
        story:
          "This chart illustrates the potential bundle size savings when using tree-shaking. Full echarts bundle is ~1MB, while a tree-shaken bundle with just a few charts can be ~150KB.",
      },
    },
  },
};
