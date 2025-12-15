import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { EChartsReact, EChartsReactRef } from "../src";
import type { EChartsOption } from "echarts";
import { resizeObserverInstances } from "../vitest.setup";

// Basic chart option for testing
const basicOption: EChartsOption = {
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

describe("EChartsReact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear tracked ResizeObserver instances
    resizeObserverInstances.length = 0;
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<EChartsReact option={basicOption} />);
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with default height of 300px", () => {
      const { container } = render(<EChartsReact option={basicOption} />);
      const chartDiv = container.querySelector(".echarts-react");
      expect(chartDiv).toHaveStyle({ height: "300px" });
    });

    it("renders with custom style", () => {
      const { container } = render(
        <EChartsReact option={basicOption} style={{ height: 500, width: 800 }} />
      );
      const chartDiv = container.querySelector(".echarts-react");
      expect(chartDiv).toHaveStyle({ height: "500px", width: "800px" });
    });

    it("renders with custom className", () => {
      const { container } = render(
        <EChartsReact option={basicOption} className="my-custom-chart" />
      );
      const chartDiv = container.querySelector(".echarts-react");
      expect(chartDiv).toHaveClass("echarts-react", "my-custom-chart");
    });

    it("passes HTML attributes to the container div", () => {
      render(
        <EChartsReact
          option={basicOption}
          data-testid="chart-container"
          aria-label="Sales Chart"
        />
      );
      const chartDiv = screen.getByTestId("chart-container");
      expect(chartDiv).toHaveAttribute("aria-label", "Sales Chart");
    });
  });

  describe("Ref Access", () => {
    it("exposes getEchartsInstance via ref", async () => {
      const ref = createRef<EChartsReactRef>();
      render(<EChartsReact ref={ref} option={basicOption} />);

      await waitFor(() => {
        expect(ref.current).not.toBeNull();
        expect(ref.current?.getEchartsInstance).toBeDefined();
      });
    });

    it("returns ECharts instance from getEchartsInstance", async () => {
      const ref = createRef<EChartsReactRef>();
      render(<EChartsReact ref={ref} option={basicOption} />);

      await waitFor(() => {
        const instance = ref.current?.getEchartsInstance();
        expect(instance).not.toBeNull();
      });
    });
  });

  describe("Callbacks", () => {
    it("calls onChartReady when chart is initialized", async () => {
      const onChartReady = vi.fn();
      render(
        <EChartsReact option={basicOption} onChartReady={onChartReady} />
      );

      await waitFor(() => {
        expect(onChartReady).toHaveBeenCalledTimes(1);
        expect(onChartReady).toHaveBeenCalledWith(expect.anything());
      });
    });
  });

  describe("Loading State", () => {
    it("renders with showLoading=true", () => {
      const { container } = render(
        <EChartsReact option={basicOption} showLoading={true} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with custom loading options", () => {
      const loadingOption = {
        text: "Loading data...",
        color: "#c23531",
      };
      const { container } = render(
        <EChartsReact
          option={basicOption}
          showLoading={true}
          loadingOption={loadingOption}
        />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });
  });

  describe("Renderer Options", () => {
    it("renders with canvas renderer by default", () => {
      const { container } = render(<EChartsReact option={basicOption} />);
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with SVG renderer when specified", () => {
      const { container } = render(
        <EChartsReact option={basicOption} opts={{ renderer: "svg" }} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("accepts devicePixelRatio option", () => {
      const { container } = render(
        <EChartsReact option={basicOption} opts={{ devicePixelRatio: 2 }} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });
  });

  describe("Update Control", () => {
    it("renders with notMerge=true", () => {
      const { container } = render(
        <EChartsReact option={basicOption} notMerge={true} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with lazyUpdate=true", () => {
      const { container } = render(
        <EChartsReact option={basicOption} lazyUpdate={true} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with replaceMerge option", () => {
      const { container } = render(
        <EChartsReact option={basicOption} replaceMerge={["series"]} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("uses shouldSetOption to control updates", async () => {
      const shouldSetOption = vi.fn().mockReturnValue(true);
      const { rerender } = render(
        <EChartsReact
          option={basicOption}
          shouldSetOption={shouldSetOption}
        />
      );

      const newOption = { ...basicOption, series: [{ data: [1, 2, 3], type: "line" }] };
      rerender(
        <EChartsReact
          option={newOption}
          shouldSetOption={shouldSetOption}
        />
      );

      await waitFor(() => {
        expect(shouldSetOption).toHaveBeenCalled();
      });
    });
  });

  describe("Theme Support", () => {
    it("renders with string theme", () => {
      const { container } = render(
        <EChartsReact option={basicOption} theme="dark" />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });

    it("renders with object theme", () => {
      const customTheme = {
        backgroundColor: "#1a1a2e",
        textStyle: { color: "#eaeaea" },
      };
      const { container } = render(
        <EChartsReact option={basicOption} theme={customTheme} />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("renders with onEvents prop", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <EChartsReact
          option={basicOption}
          onEvents={{ click: handleClick }}
        />
      );
      expect(container.querySelector(".echarts-react")).toBeInTheDocument();
    });
  });

  describe("Auto Resize", () => {
    it("sets up ResizeObserver when autoResize is true (default)", () => {
      render(<EChartsReact option={basicOption} />);
      expect(resizeObserverInstances.length).toBeGreaterThan(0);
    });

    it("does not set up ResizeObserver when autoResize is false", () => {
      render(<EChartsReact option={basicOption} autoResize={false} />);
      expect(resizeObserverInstances.length).toBe(0);
    });
  });

  describe("Cleanup", () => {
    it("cleans up on unmount", () => {
      const { unmount } = render(<EChartsReact option={basicOption} />);
      unmount();
      // No errors thrown during cleanup
    });

    it("disconnects ResizeObserver on unmount", () => {
      const { unmount } = render(<EChartsReact option={basicOption} />);

      expect(resizeObserverInstances.length).toBeGreaterThan(0);
      const instance = resizeObserverInstances[0];

      unmount();

      expect(instance.disconnect).toHaveBeenCalled();
    });
  });
});
