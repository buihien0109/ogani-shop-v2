import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
      text: 'Top sản phẩm bán chạy',
    },
  },
};

function ProductChart(props) {
  const data = {
    labels: props.data?.map((product) => product?.name.slice(0, 10) + '...'),
    datasets: [
      {
        label: 'Lượt bán',
        data: props.data.map((product) => product?.quantity),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return <Bar options={options} data={data} />;
}

export default ProductChart;
