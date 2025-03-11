# React ECharts Library

A modern React wrapper for Apache ECharts v5 with TypeScript support.

## Installation

```bash
npm install react-echarts-library echarts
# or
yarn add react-echarts-library echarts
```

## Basic Usage

```jsx
import React from 'react';
import EChartsReact from 'react-echarts-library';

const SimpleChart = () => {
  const option = {
    title: {
      text: 'Basic Line Chart'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };

  return <EChartsReact option={option} style={{ height: 400 }} />;
};

export default SimpleChart;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| option | EChartOption | required | ECharts option config |
| theme | string or object | - | Theme to be applied |
| style | CSSProperties | { height: 300 } | Container style |
| className | string | '' | Container class name |
| autoResize | boolean | true | Enable auto resize |
| onChartReady | Function | - | Callback when chart is ready |
| onEvents | Object | {} | Event handlers |

## Event Handling

```jsx
const Chart = () => {
  const option = { /* chart options */ };
  
  const onEvents = {
    'click': (params, chart) => {
      console.log(params, chart);
    }
  };
  
  return <EChartsReact option={option} onEvents={onEvents} />;
};
```

## Accessing the Chart Instance

You can access the echarts instance through the `onChartReady` callback:

```jsx
const Chart = () => {
  const option = { /* chart options */ };
  
  const handleChartReady = (chart) => {
    // Do something with the chart instance
    chart.resize();
  };
  
  return <EChartsReact option={option} onChartReady={handleChartReady} />;
};
```

## Examples

See the [examples folder](./example) for more examples of various chart types and configurations.

## License

MIT
