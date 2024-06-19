import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Doanh thu theo tháng',
    },
  },
};

function RevenueExpenseChart(props) {
  const data = {
    labels: props.data?.map((v) => `${v?.month}/${v?.year}`),
    datasets: [
      {
        label: 'Doanh thu',
        data: props.data.map((v) => v?.revenue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Chi phí',
        data: props.data.map((v) => v?.expense),
        borderColor: '#2196f3',
        backgroundColor: '#89c0ec',
      }
    ],
  };
  return <Line options={options} data={data} />;
}

export default RevenueExpenseChart;
