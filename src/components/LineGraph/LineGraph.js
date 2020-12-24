import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      lable: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },

  scales:{
    xAxes: [
      {
        type: "time",
        time: {
          parser : "MM/DD/YY",
          tooltipFormat: "ll"
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          callback: function(value, index, values) {
            return numeral(value).format("0a");
          }
        },
      },
    ],
  }
}

//data for line chart
const  buildChartData = (data, casesType) => {
  const chartData = [];
  let lastDataPoint;//it consist of only raw cases number 
  for(let date in data.cases) {
    if( lastDataPoint ) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph( { casesType="cases", ...props } ) {
  const urlLineData = 'https://disease.sh/v3/covid-19/historical/all?lastdays=120';
  const [ lineData, setLineData ] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
     await fetch(urlLineData)
    .then((response) => response.json())
    .then((data) => {
      const chartData = buildChartData(data, casesType);
      setLineData(chartData);
    });
    }
    fetchData();
  }, [casesType])

  return (
    <div className = {props.className} >
      {/* lineData?.length is chainning check data exist or not */}
      {lineData?.length > 0 && (
          <Line options={options}
          data={{
             datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: lineData
              },
            ],
           }} />
        )
      }
      
    </div>
  )
}

export default LineGraph
