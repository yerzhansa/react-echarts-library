import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import type { EChartsType } from "echarts/core";
import { exportToPNG, exportToSVG } from "../src/utils/export";
import { useChartTheme } from "../src/utils/useChartTheme";

function createMockChart(overrides: Partial<EChartsType> = {}): EChartsType {
  return {
    getDataURL: vi.fn().mockReturnValue("data:image/png;base64,FAKE"),
    ...overrides,
  } as unknown as EChartsType;
}

describe("exportToPNG", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("returns the data URL from chart.getDataURL", () => {
    const chart = createMockChart();
    const url = exportToPNG(chart);
    expect(url).toBe("data:image/png;base64,FAKE");
    expect(chart.getDataURL).toHaveBeenCalledWith({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      excludeComponents: undefined,
    });
  });

  it("forwards pixelRatio, backgroundColor, and excludeComponents", () => {
    const chart = createMockChart();
    exportToPNG(chart, {
      pixelRatio: 3,
      backgroundColor: "#111",
      excludeComponents: ["toolbox"],
    });
    expect(chart.getDataURL).toHaveBeenCalledWith({
      type: "png",
      pixelRatio: 3,
      backgroundColor: "#111",
      excludeComponents: ["toolbox"],
    });
  });

  it("triggers a download when filename is provided", () => {
    const chart = createMockChart();
    const clickSpy = vi.fn();
    const anchorStub = {
      href: "",
      download: "",
      click: clickSpy,
    } as unknown as HTMLAnchorElement;
    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue(anchorStub);
    const appendChildSpy = vi
      .spyOn(document.body, "appendChild")
      .mockReturnValue(anchorStub as unknown as Node);
    const removeChildSpy = vi
      .spyOn(document.body, "removeChild")
      .mockReturnValue(anchorStub as unknown as Node);

    exportToPNG(chart, { filename: "sales.png" });

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(anchorStub.href).toBe("data:image/png;base64,FAKE");
    expect(anchorStub.download).toBe("sales.png");
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});

describe("exportToSVG", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses renderToSVGString when the SVG renderer is in use", () => {
    const chart = createMockChart({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderToSVGString: vi.fn().mockReturnValue("<svg><rect /></svg>"),
    } as any);
    const url = exportToSVG(chart);
    expect(url.startsWith("data:image/svg+xml;charset=utf-8,")).toBe(true);
    expect(decodeURIComponent(url.split(",")[1])).toBe("<svg><rect /></svg>");
  });

  it("falls back to getDataURL when renderToSVGString is unavailable", () => {
    const chart = createMockChart({
      getDataURL: vi.fn().mockReturnValue("data:image/svg+xml;base64,FAKE"),
    });
    const url = exportToSVG(chart);
    expect(chart.getDataURL).toHaveBeenCalledWith({
      type: "svg",
      backgroundColor: "#ffffff",
      excludeComponents: undefined,
    });
    expect(url).toBe("data:image/svg+xml;base64,FAKE");
  });
});

describe("useChartTheme", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    cleanup();
  });

  function mockMatchMedia(matches: boolean) {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    const mql = {
      matches,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener: (_type: string, listener: (e: MediaQueryListEvent) => void) => {
        listeners.push(listener);
      },
      removeEventListener: (_type: string, listener: (e: MediaQueryListEvent) => void) => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
      },
      dispatchEvent: () => true,
      // legacy fallbacks
      addListener: () => {},
      removeListener: () => {},
    } as unknown as MediaQueryList & { _emit: (matches: boolean) => void };
    (mql as unknown as { _emit: (matches: boolean) => void })._emit = (newMatches: boolean) => {
      listeners.forEach((l) =>
        l({ matches: newMatches, media: mql.media } as MediaQueryListEvent)
      );
    };
    window.matchMedia = vi.fn().mockReturnValue(mql);
    return mql as unknown as MediaQueryList & { _emit: (matches: boolean) => void };
  }

  it("returns 'light' when the system is light", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useChartTheme());
    expect(result.current).toBe("light");
  });

  it("returns 'dark' when the system is dark", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useChartTheme());
    expect(result.current).toBe("dark");
  });

  it("reacts to system theme changes", () => {
    const mql = mockMatchMedia(false);
    const { result } = renderHook(() => useChartTheme());
    expect(result.current).toBe("light");
    act(() => {
      mql._emit(true);
    });
    expect(result.current).toBe("dark");
  });

  it("respects the override and ignores system", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useChartTheme("light"));
    expect(result.current).toBe("light");
  });
});
