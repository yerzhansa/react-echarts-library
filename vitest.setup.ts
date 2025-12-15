import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";

// Track ResizeObserver instances for testing
export const resizeObserverInstances: Array<{
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

// Mock ResizeObserver
const ResizeObserverMock = vi.fn().mockImplementation(() => {
  const instance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
  resizeObserverInstances.push(instance);
  return instance;
});

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 0);
});

vi.stubGlobal("cancelAnimationFrame", (id: number) => {
  clearTimeout(id);
});
