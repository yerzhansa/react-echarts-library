import type { Meta, StoryObj } from "@storybook/react";
import { EChartsReact } from "../ReactEcharts";

const meta: Meta<typeof EChartsReact> = {
  title: "Charts/Gallery",
  component: EChartsReact,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A gallery of chart types beyond the basic line/bar/pie. Each example ships realistic sample data so you can copy-paste and substitute your own.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EChartsReact>;

const gallerySize = { height: 400, width: 600 };

export const Scatter: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Height vs Weight" },
      tooltip: { trigger: "item" as const },
      xAxis: { type: "value" as const, name: "Height (cm)" },
      yAxis: { type: "value" as const, name: "Weight (kg)" },
      series: [
        {
          type: "scatter" as const,
          symbolSize: 12,
          data: [
            [161, 51],
            [167, 69],
            [159, 55],
            [177, 83],
            [170, 65],
            [158, 49],
            [172, 75],
            [181, 88],
            [164, 58],
            [169, 72],
            [175, 80],
            [163, 54],
            [168, 66],
            [180, 85],
            [162, 52],
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Scatter plot for correlation and distribution visualization.",
      },
    },
  },
};

export const Radar: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Engineer Skill Profile" },
      tooltip: {},
      legend: { data: ["Candidate A", "Candidate B"], bottom: 0 },
      radar: {
        indicator: [
          { name: "Algorithms", max: 100 },
          { name: "System Design", max: 100 },
          { name: "Frontend", max: 100 },
          { name: "DevOps", max: 100 },
          { name: "Communication", max: 100 },
        ],
      },
      series: [
        {
          type: "radar" as const,
          data: [
            { value: [80, 70, 90, 60, 85], name: "Candidate A" },
            { value: [70, 90, 60, 85, 75], name: "Candidate B" },
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Radar / spider chart for comparing entities across multiple dimensions.",
      },
    },
  },
};

const heatmapData: [number, number, number][] = Array.from(
  { length: 7 },
  (_, day) =>
    Array.from(
      { length: 24 },
      (_, hr) => [hr, day, Math.floor(Math.random() * 10)] as [number, number, number]
    )
).flat();

export const Heatmap: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Activity by Hour × Day" },
      tooltip: { position: "top" as const },
      grid: { height: "60%", top: "15%" },
      xAxis: {
        type: "category" as const,
        data: Array.from({ length: 24 }, (_, i) => `${i}h`),
        splitArea: { show: true },
      },
      yAxis: {
        type: "category" as const,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal" as const,
        left: "center",
        bottom: "5%",
      },
      series: [
        {
          type: "heatmap" as const,
          data: heatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Heatmap with VisualMap for density and activity patterns.",
      },
    },
  },
};

export const Gauge: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Quarterly Goal Progress", left: "center" },
      tooltip: { formatter: "{a} <br/>{b}: {c}%" },
      series: [
        {
          name: "Progress",
          type: "gauge" as const,
          progress: { show: true, width: 18 },
          axisLine: { lineStyle: { width: 18 } },
          detail: {
            valueAnimation: true,
            formatter: "{value}%",
            fontSize: 24,
            offsetCenter: [0, "70%"],
          },
          data: [{ value: 72, name: "Completed" }],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Gauge chart for KPIs, SLAs, and dashboards.",
      },
    },
  },
};

export const Sankey: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Traffic Flow" },
      tooltip: { trigger: "item" as const, triggerOn: "mousemove" },
      series: [
        {
          type: "sankey" as const,
          emphasis: { focus: "adjacency" as const },
          data: [
            { name: "Search" },
            { name: "Direct" },
            { name: "Social" },
            { name: "Landing" },
            { name: "Pricing" },
            { name: "Signup" },
            { name: "Converted" },
            { name: "Bounced" },
          ],
          links: [
            { source: "Search", target: "Landing", value: 500 },
            { source: "Direct", target: "Landing", value: 300 },
            { source: "Social", target: "Landing", value: 200 },
            { source: "Landing", target: "Pricing", value: 600 },
            { source: "Landing", target: "Bounced", value: 400 },
            { source: "Pricing", target: "Signup", value: 450 },
            { source: "Pricing", target: "Bounced", value: 150 },
            { source: "Signup", target: "Converted", value: 380 },
            { source: "Signup", target: "Bounced", value: 70 },
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Sankey diagram for flow and attribution between stages.",
      },
    },
  },
};

export const Funnel: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Signup Funnel" },
      tooltip: { trigger: "item" as const, formatter: "{b}: {c}" },
      series: [
        {
          name: "Signup",
          type: "funnel" as const,
          left: "10%",
          width: "80%",
          label: { show: true, position: "inside" as const },
          data: [
            { value: 1000, name: "Visited" },
            { value: 620, name: "Viewed Pricing" },
            { value: 380, name: "Signed Up" },
            { value: 210, name: "Activated" },
            { value: 95, name: "Paid" },
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: { story: "Funnel chart for conversion stages." },
    },
  },
};

export const Candlestick: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Price — Last 2 Weeks" },
      tooltip: { trigger: "axis" as const },
      xAxis: {
        type: "category" as const,
        data: [
          "Mon1",
          "Tue1",
          "Wed1",
          "Thu1",
          "Fri1",
          "Mon2",
          "Tue2",
          "Wed2",
          "Thu2",
          "Fri2",
        ],
      },
      yAxis: { type: "value" as const, scale: true },
      series: [
        {
          type: "candlestick" as const,
          // [open, close, low, high]
          data: [
            [110, 115, 108, 118],
            [115, 113, 110, 117],
            [113, 120, 112, 122],
            [120, 118, 115, 121],
            [118, 125, 117, 128],
            [125, 122, 120, 127],
            [122, 130, 121, 133],
            [130, 128, 125, 132],
            [128, 135, 127, 138],
            [135, 140, 133, 142],
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Candlestick / OHLC chart for financial price movement.",
      },
    },
  },
};

export const Treemap: Story = {
  args: {
    style: gallerySize,
    option: {
      title: { text: "Sales by Region and Product" },
      tooltip: {},
      series: [
        {
          type: "treemap" as const,
          data: [
            {
              name: "Americas",
              value: 1200,
              children: [
                { name: "US", value: 800 },
                { name: "Canada", value: 250 },
                { name: "Brazil", value: 150 },
              ],
            },
            {
              name: "EMEA",
              value: 900,
              children: [
                { name: "UK", value: 300 },
                { name: "Germany", value: 250 },
                { name: "France", value: 200 },
                { name: "Other", value: 150 },
              ],
            },
            {
              name: "APAC",
              value: 700,
              children: [
                { name: "Japan", value: 300 },
                { name: "India", value: 200 },
                { name: "Australia", value: 120 },
                { name: "Other", value: 80 },
              ],
            },
          ],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Treemap for hierarchical proportion visualization.",
      },
    },
  },
};
