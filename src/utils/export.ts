"use client";

import type { EChartsType } from "echarts/core";

/**
 * Options for exporting a chart as an image.
 */
export interface ExportImageOptions {
  /** Device pixel ratio. Defaults to 2 for PNG (SVG ignores this). */
  pixelRatio?: number;
  /** Background color behind the chart. Defaults to white. */
  backgroundColor?: string;
  /** ECharts component types to exclude from the export (e.g. ['toolbox']). */
  excludeComponents?: string[];
  /**
   * If provided, triggers a browser download with this filename instead of
   * only returning the data URL.
   */
  filename?: string;
}

function triggerDownload(dataURL: string, filename: string): void {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Export a chart as a PNG data URL. Pass a `filename` to also trigger a
 * browser download.
 *
 * @example
 * ```tsx
 * const url = exportToPNG(chart, { filename: 'sales.png', pixelRatio: 3 });
 * ```
 */
export function exportToPNG(
  chart: EChartsType,
  {
    pixelRatio = 2,
    backgroundColor = "#ffffff",
    excludeComponents,
    filename,
  }: ExportImageOptions = {}
): string {
  const dataURL = chart.getDataURL({
    type: "png",
    pixelRatio,
    backgroundColor,
    excludeComponents,
  });
  if (filename) triggerDownload(dataURL, filename);
  return dataURL;
}

/**
 * Export a chart as an SVG data URL. Requires the chart to have been
 * initialized with `opts: { renderer: 'svg' }` for best fidelity; falls
 * back to ECharts' canvas-to-SVG `getDataURL({ type: 'svg' })` otherwise.
 *
 * @example
 * ```tsx
 * const url = exportToSVG(chart, { filename: 'sales.svg' });
 * ```
 */
export function exportToSVG(
  chart: EChartsType,
  {
    backgroundColor = "#ffffff",
    excludeComponents,
    filename,
  }: Omit<ExportImageOptions, "pixelRatio"> = {}
): string {
  // `renderToSVGString` is only available when the SVG renderer is in use.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderFn = (chart as any).renderToSVGString as
    | (() => string)
    | undefined;
  let dataURL: string;
  if (typeof renderFn === "function") {
    const svg = renderFn.call(chart);
    dataURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } else {
    dataURL = chart.getDataURL({
      type: "svg",
      backgroundColor,
      excludeComponents,
    });
  }
  if (filename) triggerDownload(dataURL, filename);
  return dataURL;
}
