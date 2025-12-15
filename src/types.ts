import type { EChartsType } from "echarts/core";
import type { EChartsOption } from "echarts";

/**
 * ECharts core type for tree-shaking support.
 * Represents the echarts/core module with the init function.
 */
export interface EChartsCore {
  init: (
    dom: HTMLElement,
    theme?: string | object,
    opts?: EChartsInitOpts
  ) => EChartsType;
}

/**
 * Initialization options passed to echarts.init()
 */
export interface EChartsInitOpts {
  /** Rendering mode: 'canvas' (default) or 'svg' */
  renderer?: "canvas" | "svg";
  /** Device pixel ratio for high-DPI displays */
  devicePixelRatio?: number;
  /** Chart width (number in pixels or 'auto' for container width) */
  width?: number | "auto";
  /** Chart height (number in pixels or 'auto' for container height) */
  height?: number | "auto";
  /** Locale for internationalization */
  locale?: string;
  /** Use dirty rectangle rendering for optimization */
  useDirtyRect?: boolean;
}

/**
 * Loading options for showLoading
 */
export interface EChartsLoadingOption {
  text?: string;
  color?: string;
  textColor?: string;
  maskColor?: string;
  zlevel?: number;
  fontSize?: number;
  showSpinner?: boolean;
  spinnerRadius?: number;
  lineWidth?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fontFamily?: string;
}

/**
 * Base props shared between EChartsCore and EChartsReact components.
 * Does not include the echarts instance - that's added by EChartsCoreProps.
 */
export interface EChartsBaseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** ECharts option configuration (required) */
  option: EChartsOption;
  /** Theme name (string) or custom theme object */
  theme?: string | object;
  /** Container style (default: { height: 300 }) */
  style?: React.CSSProperties;
  /** Additional CSS class name */
  className?: string;
  /** Auto-resize chart when container size changes (default: true) */
  autoResize?: boolean;
  /** Callback when chart is initialized */
  onChartReady?: (chart: EChartsType) => void;
  /** Event handlers map */
  onEvents?: Record<string, (params: unknown, chart: EChartsType) => void>;
  /** Initialization options for echarts.init() */
  opts?: EChartsInitOpts;
  /** Whether to not merge with previous option (default: false) */
  notMerge?: boolean;
  /** Keys to replace instead of merge */
  replaceMerge?: string | string[];
  /** Whether to update chart lazily (default: false) */
  lazyUpdate?: boolean;
  /** Show loading animation (default: false) */
  showLoading?: boolean;
  /** Loading animation options */
  loadingOption?: EChartsLoadingOption;
  /** Custom hook to control whether setOption should be called */
  shouldSetOption?: (
    prevProps: EChartsBaseProps,
    props: EChartsBaseProps
  ) => boolean;
}

/**
 * Props for EChartsCore component (tree-shakeable version).
 * Requires an echarts instance to be passed.
 */
export interface EChartsCoreProps extends EChartsBaseProps {
  /** ECharts instance (required for tree-shaking support) */
  echarts: EChartsCore;
}

/**
 * Props for EChartsReact component (full bundle version).
 * Does not require echarts instance - uses the full echarts bundle.
 */
export type EChartsReactProps = EChartsBaseProps;

/**
 * Ref handle exposed by EChartsReact and EChartsCore components.
 */
export interface EChartsReactRef {
  /** Get the ECharts instance */
  getEchartsInstance: () => EChartsType | null;
}

// Re-export echarts types for convenience
export type { EChartsType, EChartsOption };
