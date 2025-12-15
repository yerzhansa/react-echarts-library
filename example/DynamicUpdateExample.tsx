import React, { useState, useEffect, useCallback } from "react";
import { EChartsReact } from "../src";
import type { EChartsOption } from "echarts";

/**
 * Example demonstrating dynamic update control
 * - notMerge: Replace entire option instead of merging
 * - lazyUpdate: Defer chart update for better performance
 * - shouldSetOption: Custom logic to control when updates happen
 */
const DynamicUpdateExample = () => {
  const [data, setData] = useState<number[]>([150, 230, 224, 218, 135, 147, 260]);
  const [notMerge, setNotMerge] = useState(false);
  const [lazyUpdate, setLazyUpdate] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((v) => Math.max(50, v + (Math.random() - 0.5) * 50))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const option: EChartsOption = {
    title: {
      text: "Dynamic Update Control",
      subtext: `Updates: ${updateCount} | notMerge: ${notMerge} | lazyUpdate: ${lazyUpdate}`,
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
      min: 0,
      max: 400,
    },
    series: [
      {
        name: "Value",
        type: "line",
        data: data,
        smooth: true,
        animationDuration: lazyUpdate ? 0 : 300,
      },
    ],
  };

  // Custom shouldSetOption to control updates
  const shouldSetOption = useCallback(
    (prevProps: any, currentProps: any) => {
      // Increment update counter
      setUpdateCount((c) => c + 1);
      // Always allow updates in this example
      return true;
    },
    []
  );

  const handleResetData = () => {
    setData([150, 230, 224, 218, 135, 147, 260]);
    setUpdateCount(0);
  };

  const handleRandomizeAll = () => {
    setData(Array.from({ length: 7 }, () => Math.floor(Math.random() * 350) + 50));
  };

  return (
    <div className="chart-container">
      <h2>Dynamic Update Example</h2>
      <p>
        Uses <code>notMerge</code>, <code>lazyUpdate</code>, and{" "}
        <code>shouldSetOption</code>
      </p>

      <div style={{ marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <label>
          <input
            type="checkbox"
            checked={notMerge}
            onChange={(e) => setNotMerge(e.target.checked)}
          />{" "}
          notMerge (replace entire option)
        </label>
        <label>
          <input
            type="checkbox"
            checked={lazyUpdate}
            onChange={(e) => setLazyUpdate(e.target.checked)}
          />{" "}
          lazyUpdate (defer rendering)
        </label>
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button onClick={handleResetData}>Reset Data</button>
        <button onClick={handleRandomizeAll}>Randomize All</button>
      </div>

      <div
        style={{
          padding: 8,
          background: "#f0f8ff",
          borderRadius: 4,
          marginBottom: 16,
          fontSize: 12,
        }}
      >
        <strong>Tips:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
          <li>
            <strong>notMerge=true</strong>: Replaces the entire chart option
            instead of merging. Use when switching chart types or completely
            changing data structure.
          </li>
          <li>
            <strong>lazyUpdate=true</strong>: Defers rendering updates. Better
            performance for rapid updates but less smooth animations.
          </li>
          <li>
            <strong>shouldSetOption</strong>: Custom function to control when
            setOption is called. Useful for debouncing or conditional updates.
          </li>
        </ul>
      </div>

      <EChartsReact
        option={option}
        style={{ height: 400, width: "100%" }}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
        shouldSetOption={shouldSetOption}
      />
    </div>
  );
};

export default DynamicUpdateExample;
