import React, { useState, useEffect } from "react";
import { EChartsReact } from "../src";
import type { EChartsOption } from "echarts";

/**
 * Example demonstrating the loading state feature
 * - showLoading prop to show/hide loading animation
 * - loadingOption to customize the loading appearance
 */
const LoadingStateExample = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<number[]>([]);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setData([320, 302, 301, 334, 390, 330, 320]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const option: EChartsOption = {
    title: {
      text: "Loading State Demo",
      subtext: "Data loads after 2 seconds",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Sales",
        type: "bar",
        data: data,
        itemStyle: {
          color: "#5470c6",
        },
      },
    ],
  };

  // Custom loading options
  const loadingOption = {
    text: "Loading data...",
    color: "#5470c6",
    textColor: "#333",
    maskColor: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    showSpinner: true,
    spinnerRadius: 12,
  };

  const handleRefresh = () => {
    setData([]);
    setIsLoading(true);
    setTimeout(() => {
      setData([
        Math.random() * 400,
        Math.random() * 400,
        Math.random() * 400,
        Math.random() * 400,
        Math.random() * 400,
        Math.random() * 400,
        Math.random() * 400,
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="chart-container">
      <h2>Loading State Example</h2>
      <p>
        Uses <code>showLoading</code> and <code>loadingOption</code> props
      </p>
      <button onClick={handleRefresh} style={{ marginBottom: 16 }}>
        Refresh Data
      </button>
      <EChartsReact
        option={option}
        style={{ height: 400, width: "100%" }}
        showLoading={isLoading}
        loadingOption={loadingOption}
      />
    </div>
  );
};

export default LoadingStateExample;
