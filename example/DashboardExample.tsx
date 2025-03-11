import React, { useState, useEffect } from 'react';
import EChartsReact from 'react-echarts-library';
import type { EChartOption } from 'echarts';

/**
 * Dashboard Example Component
 * 
 * This example shows how to create a dashboard with multiple charts
 * using the react-echarts-library.
 */
const DashboardExample = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    salesData: [],
    categoryData: [],
    trafficData: [],
    conversionData: []
  });

  // Simulate data loading
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setData({
        salesData: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
        categoryData: [
          { value: 1048, name: 'Electronics' },
          { value: 735, name: 'Clothing' },
          { value: 580, name: 'Food' },
          { value: 484, name: 'Books' },
          { value: 300, name: 'Other' }
        ],
        trafficData: [
          [0, 0, 5],
          [0, 1, 1],
          [0, 2, 0],
          [0, 3, 0],
          [0, 4, 0],
          [0, 5, 0],
          [0, 6, 0],
          [0, 7, 0],
          [0, 8, 0],
          [0, 9, 0],
          [0, 10, 0],
          [0, 11, 2],
          [0, 12, 4],
          [0, 13, 1],
          [0, 14, 1],
          [0, 15, 3],
          [0, 16, 4],
          [0, 17, 6],
          [0, 18, 4],
          [0, 19, 4],
          [0, 20, 3],
          [0, 21, 3],
          [0, 22, 2],
          [0, 23, 5],
          [1, 0, 7],
          [1, 1, 0],
          // ... more data would go here in a real app
        ],
        conversionData: [
          { value: 60, name: 'Conversion' },
          { value: 40, name: 'Drop-off' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  // Sales Trend Chart
  const salesOption: EChartOption = {
    title: {
      text: 'Monthly Sales Trend',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Sales',
        type: 'line',
        data: data.salesData,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        smooth: true,
        lineStyle: {
          width: 4
        }
      }
    ],
    color: ['#3398DB']
  };

  // Category Distribution Chart
  const categoryOption: EChartOption = {
    title: {
      text: 'Sales by Category',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 16
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.categoryData.map(item => item.name)
    },
    series: [
      {
        name: 'Category',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.categoryData
      }
    ]
  };

  // Traffic Heatmap Chart
  const trafficOption: EChartOption = {
    title: {
      text: 'Website Traffic Heatmap',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 16
      }
    },
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['Sun', 'Mon'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%'
    },
    series: [
      {
        name: 'Traffic',
        type: 'heatmap',
        data: data.trafficData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // Conversion Rate Chart
  const conversionOption: EChartOption = {
    title: {
      text: 'Conversion Rate',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 16
      },
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Conversion',
        type: 'pie',
        radius: '50%',
        data: data.conversionData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color: ['#91cc75', '#ee6666']
  };

  // Chart Ready Handler
  const handleChartReady = (chart: any) => {
    if (loading) {
      chart.showLoading({
        text: 'Loading data...',
        color: '#3398DB',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      });
    } else {
      chart.hideLoading();
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Sales Dashboard</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {/* Sales Trend Chart */}
        <div style={{ flex: '1 1 45%', minWidth: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <EChartsReact
            option={salesOption}
            style={{ height: '400px', width: '100%' }}
            onChartReady={handleChartReady}
          />
        </div>

        {/* Category Chart */}
        <div style={{ flex: '1 1 45%', minWidth: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <EChartsReact
            option={categoryOption}
            style={{ height: '400px', width: '100%' }}
            onChartReady={handleChartReady}
          />
        </div>

        {/* Traffic Heatmap */}
        <div style={{ flex: '1 1 45%', minWidth: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <EChartsReact
            option={trafficOption}
            style={{ height: '400px', width: '100%' }}
            onChartReady={handleChartReady}
          />
        </div>

        {/* Conversion Chart */}
        <div style={{ flex: '1 1 45%', minWidth: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <EChartsReact
            option={conversionOption}
            style={{ height: '400px', width: '100%' }}
            onChartReady={handleChartReady}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardExample; 