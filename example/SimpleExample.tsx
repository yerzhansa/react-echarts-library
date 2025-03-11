import React, { useState } from 'react';
import EChartsReact from 'react-echarts-library';
import type { EChartOption } from 'echarts';

/**
 * Simple Example Component
 * 
 * This example demonstrates the most basic usage of the EChartsReact component.
 */
const SimpleExample = () => {
  // Define the chart options
  const option: EChartOption = {
    title: {
      text: 'ECharts Basic Example',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Sales', 'Expenses'],
      bottom: 'bottom'
    },
    xAxis: {
      type: 'category',
      data: ['January', 'February', 'March', 'April', 'May', 'June']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
        name: 'Expenses',
        type: 'line',
        data: [15, 12, 25, 9, 11, 16]
      }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React ECharts Library - Simple Example</h1>
      <p>This example demonstrates the basic usage of the EChartsReact component.</p>
      
      <div style={{ 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
        borderRadius: '8px', 
        padding: '20px',
        marginTop: '20px'
      }}>
        <EChartsReact 
          option={option} 
          style={{ height: '400px', width: '100%' }}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>How to implement:</h2>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          overflowX: 'auto'
        }}>
{`import React from 'react';
import EChartsReact from 'react-echarts-library';

const MyComponent = () => {
  const option = {
    title: { text: 'ECharts Basic Example' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
  };

  return <EChartsReact option={option} style={{ height: '400px', width: '100%' }} />;
};

export default MyComponent;`}
        </pre>
      </div>
    </div>
  );
};

export default SimpleExample; 