import * as echarts from "echarts";
import {
  CSSProperties,
  FC,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { EChartOption, EChartsResponsiveOption } from "echarts";

interface EChartsProps {
  options: EChartOption | EChartsResponsiveOption;
  style?: CSSProperties;
  className?: string;
  onChartReady?: (chart: echarts.ECharts) => void;
  theme?: object | string;
  opts: {
    devicePixelRatio?: number | undefined;
    renderer?: string | undefined;
    width?: number | string | undefined;
    height?: number | string | undefined;
  };
}

const ReactEcharts: FC<EChartsProps> = ({
  options,
  style = { height: 400, width: "100%" },
  className = "",
  onChartReady,
  theme,
  opts = {
    renderer: "canvas",
  },
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current, theme, opts);
      chartInstance.setOption(options);
      setChart(chartInstance);

      onChartReady?.(chartInstance);

      return () => {
        chartInstance.dispose();
      };
    }
  }, [options]);

  return <div ref={chartRef} style={style} className={className} />;
};

export default ReactEcharts;
