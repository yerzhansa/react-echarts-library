#  React ECharts Library

A modern, lightweight React wrapper for Apache ECharts (v5+) with full TypeScript support.

## Installation

```npm  install react-echarts-library```

## Requirements

### Peer Dependencies

-   React (^16.8.0 || ^17.0.0 || ^18.0.0)
-   ECharts (^5.4.0)

## Usage

### Basic Example

```
import  { ReactEcharts }  from  'react-echarts-library'; 

const MyChart: React.FC  =  ()  =>  {
  const options =  {
    xAxis: { 
      type:  'category', 
      data:  ['Mon',  'Tue',  'Wed',  'Thu',  'Fri'] 
    },
    yAxis: { 
      type: 'value',
    },
    series: [{ 
      data: [120,  200,  150,  80,  70], 
      type:  'bar' 
    }]
  };
```

## Props

| Prop |  Type | Required | Default | Description |
|-------|-------|-------------|----------|---------|
| options | EChartOption \| EChartsResponsiveOption | Yes | - | ECharts configuration options |
| style | CSSProperties | No | { height: 400, width: "100%" } | Container styles| 
className | string | No | "" | CSS class name | 
onChartReady | (chart: echarts.ECharts) => void | No | - | Chart instance ready callback |

## Advanced Usage

### Accessing Chart Instance

```
const MyChart: React.FC = () => {
  const  handleChartReady = (chart: echarts.ECharts) => {
    chart.resize();
  };

  return (
    <ReactEcharts 
      options={options} 
      onChartReady={handleChartReady} 
      style={{ height: '500px' }}
    />
  );  
};
```

## Features
-   Full TypeScript support
-   Modern React hooks implementation
-   Automatic chart disposal
-   Responsive design support
-   Custom styling options
-   Chart instance access
-   Tree-shakeable imports

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

Found a bug or have a suggestion? Please open an issue on GitHub.
