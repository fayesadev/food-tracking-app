import React from 'react'
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../data/chartData';





const Stacked = ({ width, height, data }) => {
  const stackedChartData = data;
console.log(data);
  const stackedCustomSeries = [

    {
      dataSource: stackedChartData[0],
      xName: 'x',
      yName: 'y',
      name: 'Protein',
      type: 'StackingColumn',
    },

    {
      dataSource: stackedChartData[1],
      xName: 'x',
      yName: 'y',
      name: 'Fat',
      type: 'StackingColumn',
    },

    {
      dataSource: stackedChartData[2],
      xName: 'x',
      yName: 'y',
      name: 'Carbs',
      type: 'StackingColumn',
    },

  ];


  return (
    <ChartComponent
      id='charts'
      width={width}
      height={height}
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => {
          return <SeriesDirective key={index} {...item} />
        })}
      </SeriesCollectionDirective>
    </ChartComponent>
  )
}

export default Stacked;