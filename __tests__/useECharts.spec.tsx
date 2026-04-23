import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook, cleanup, waitFor, act } from "@testing-library/react";
import { useEffect } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { useECharts } from "../src/useECharts";
import { resizeObserverInstances } from "../vitest.setup";

const basicOption: EChartsOption = {
  xAxis: { type: "category", data: ["A", "B", "C"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [10, 20, 30] }],
};

/**
 * Test harness: a component that calls useECharts and exposes both the
 * container ref and the instance getter. We render it and drive prop
 * changes through rerender to exercise the hook's update effect.
 */
function Harness(props: Parameters<typeof useECharts>[1] & { onReady?: (getInstance: () => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) => void }) {
  const { onReady, ...hookOptions } = props;
  const { containerRef, getInstance } = useECharts(echarts, hookOptions);
  useEffect(() => {
    onReady?.(getInstance);
  }, [getInstance, onReady]);
  return <div ref={containerRef} data-testid="chart" style={{ height: 300, width: 400 }} />;
}

describe("useECharts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resizeObserverInstances.length = 0;
  });

  afterEach(() => {
    cleanup();
  });

  it("returns a containerRef callback and a getInstance function", () => {
    const { result } = renderHook(() => useECharts(echarts, { option: basicOption }));
    expect(typeof result.current.containerRef).toBe("function");
    expect(typeof result.current.getInstance).toBe("function");
    expect(result.current.getInstance()).toBeNull(); // not mounted yet
  });

  it("mounts an ECharts instance after the container is attached", async () => {
    let captured: (() => unknown) | null = null;
    render(<Harness option={basicOption} onReady={(g) => { captured = g; }} />);
    await waitFor(() => {
      expect(captured).not.toBeNull();
      expect(captured!()).not.toBeNull();
    });
  });

  it("disposes the instance on unmount", async () => {
    let captured: (() => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) | null = null;
    const { unmount } = render(
      <Harness option={basicOption} onReady={(g) => { captured = g; }} />
    );
    await waitFor(() => expect(captured!()).not.toBeNull());
    const instance = captured!();
    unmount();
    expect(instance!.isDisposed()).toBe(true);
  });

  it("attaches a ResizeObserver when autoResize is true (default)", async () => {
    render(<Harness option={basicOption} />);
    await waitFor(() => {
      expect(resizeObserverInstances.length).toBeGreaterThan(0);
    });
  });

  it("skips ResizeObserver when autoResize is false", async () => {
    render(<Harness option={basicOption} autoResize={false} />);
    // small yield so any async effect would have run
    await act(async () => {});
    expect(resizeObserverInstances.length).toBe(0);
  });

  it("calls onChartReady once after mount", async () => {
    const onChartReady = vi.fn();
    render(<Harness option={basicOption} onChartReady={onChartReady} />);
    await waitFor(() => expect(onChartReady).toHaveBeenCalledTimes(1));
  });

  it("propagates option changes via setOption", async () => {
    let captured: (() => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) | null = null;
    const { rerender } = render(
      <Harness option={basicOption} onReady={(g) => { captured = g; }} />
    );
    await waitFor(() => expect(captured!()).not.toBeNull());
    const instance = captured!();
    const spy = vi.spyOn(instance!, "setOption");
    const newOption: EChartsOption = {
      ...basicOption,
      series: [{ type: "bar", data: [99, 99, 99] }],
    };
    rerender(<Harness option={newOption} onReady={(g) => { captured = g; }} />);
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it("skips setOption when shouldSetOption returns false", async () => {
    let captured: (() => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) | null = null;
    const shouldSetOption = vi.fn().mockReturnValue(false);
    const { rerender } = render(
      <Harness
        option={basicOption}
        shouldSetOption={shouldSetOption}
        onReady={(g) => { captured = g; }}
      />
    );
    await waitFor(() => expect(captured!()).not.toBeNull());
    const instance = captured!();
    const setOptionSpy = vi.spyOn(instance!, "setOption");
    const newOption: EChartsOption = {
      ...basicOption,
      series: [{ type: "bar", data: [1, 2, 3] }],
    };
    rerender(
      <Harness
        option={newOption}
        shouldSetOption={shouldSetOption}
        onReady={(g) => { captured = g; }}
      />
    );
    await waitFor(() => expect(shouldSetOption).toHaveBeenCalled());
    expect(setOptionSpy).not.toHaveBeenCalled();
  });

  it("toggles showLoading based on the prop", async () => {
    let captured: (() => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) | null = null;
    const { rerender } = render(
      <Harness option={basicOption} showLoading onReady={(g) => { captured = g; }} />
    );
    await waitFor(() => expect(captured!()).not.toBeNull());
    const instance = captured!();
    const hideSpy = vi.spyOn(instance!, "hideLoading");
    rerender(<Harness option={basicOption} showLoading={false} onReady={(g) => { captured = g; }} />);
    await waitFor(() => expect(hideSpy).toHaveBeenCalled());
  });

  it("rebinds events when the onEvents map changes identity", async () => {
    let captured: (() => ReturnType<ReturnType<typeof useECharts>["getInstance"]>) | null = null;
    const handler1 = vi.fn();
    const { rerender } = render(
      <Harness
        option={basicOption}
        onEvents={{ click: handler1 }}
        onReady={(g) => { captured = g; }}
      />
    );
    await waitFor(() => expect(captured!()).not.toBeNull());
    const instance = captured!();
    const offSpy = vi.spyOn(instance!, "off");
    const onSpy = vi.spyOn(instance!, "on");
    const handler2 = vi.fn();
    rerender(
      <Harness
        option={basicOption}
        onEvents={{ click: handler2 }}
        onReady={(g) => { captured = g; }}
      />
    );
    await waitFor(() => {
      expect(offSpy).toHaveBeenCalledWith("click");
      expect(onSpy).toHaveBeenCalled();
    });
  });
});
