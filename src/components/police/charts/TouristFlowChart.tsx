import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TouristFlowChart: React.FC = () => {
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb', // text-gray-200
          font: {
            family: "'Inter', sans-serif",
          }
        }
      },
      title: {
        display: true,
        text: 'Tourist Flow by Location (Last 7 Days)',
        color: '#e5e7eb', // text-gray-200
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 600,
        }
      },
      tooltip: {
        backgroundColor: '#111827', // bg-gray-900
        titleColor: '#e5e7eb', // text-gray-200
        bodyColor: '#e5e7eb', // text-gray-200
        bodyFont: {
          family: "'Inter', sans-serif"
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 600
        },
        borderColor: '#374151', // border-gray-700
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: function(tooltipItems: any) {
            return `${tooltipItems[0].label}`;
          },
          label: function(context: any) {
            return `  ${context.dataset.label}: ${context.raw} tourists`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#1f2937', // bg-gray-800
          borderColor: '#374151', // border-gray-700
        },
        ticks: {
          color: '#9ca3af', // text-gray-400
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: '#1f2937', // bg-gray-800
          borderColor: '#374151', // border-gray-700
        },
        ticks: {
          color: '#9ca3af', // text-gray-400
          font: {
            family: "'Inter', sans-serif"
          }
        },
        title: {
          display: true,
          text: 'Number of Tourists',
          color: '#9ca3af', // text-gray-400
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      }
    }
  };

  // Mock data for the past 7 days
  const labels = ['7 Days Ago', '6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', 'Yesterday', 'Today'];
  
  // Data for each Northeast India region
  const data = {
    labels,
    datasets: [
      {
        label: 'Meghalaya',
        data: [42, 55, 58, 61, 68, 72, 78],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        borderRadius: 4,
        borderColor: 'rgba(59, 130, 246, 1)', // blue-500
        borderWidth: 1,
      },
      {
        label: 'Sikkim',
        data: [35, 38, 41, 46, 52, 54, 57],
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
        borderRadius: 4,
        borderColor: 'rgba(16, 185, 129, 1)', // emerald-500
        borderWidth: 1,
      },
      {
        label: 'Assam',
        data: [48, 52, 55, 58, 62, 69, 75],
        backgroundColor: 'rgba(139, 92, 246, 0.8)', // violet-500
        borderRadius: 4,
        borderColor: 'rgba(139, 92, 246, 1)', // violet-500
        borderWidth: 1,
      },
      {
        label: 'Others',
        data: [28, 31, 32, 36, 40, 41, 44],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // amber-500
        borderRadius: 4,
        borderColor: 'rgba(245, 158, 11, 1)', // amber-500
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <Bar options={options} data={data} />
    </div>
  );
};

export default TouristFlowChart;