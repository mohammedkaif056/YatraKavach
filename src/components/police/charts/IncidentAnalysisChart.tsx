import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IncidentAnalysisChart: React.FC = () => {
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
          },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      title: {
        display: true,
        text: 'Safety Incidents by Type (Last 30 Days)',
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
            return `Date: ${tooltipItems[0].label}`;
          },
          label: function(context: any) {
            const severity = context.dataset.label.includes('High') ? 'High' : 
                             context.dataset.label.includes('Medium') ? 'Medium' : 'Low';
            const type = context.dataset.label.replace(' (High)', '')
                                            .replace(' (Medium)', '')
                                            .replace(' (Low)', '');
            
            return `  ${type} - ${severity} Severity: ${context.raw} incidents`;
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
            family: "'Inter', sans-serif",
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
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
          text: 'Number of Incidents',
          color: '#9ca3af', // text-gray-400
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        },
        min: 0
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      line: {
        tension: 0.3, // Smoother curves
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
  };

  // Mock data for the last 30 days (using 6 data points for cleaner display)
  const labels = [
    'Jun 1', 'Jun 5', 'Jun 10', 'Jun 15', 'Jun 20', 'Jun 25', 'Jun 30'
  ];

  // Color palettes based on severity
  const highSeverityColor = 'rgba(239, 68, 68, 1)'; // red-500
  const mediumSeverityColor = 'rgba(245, 158, 11, 1)'; // amber-500
  const lowSeverityColor = 'rgba(16, 185, 129, 1)'; // emerald-500

  // Data by incident type and severity
  const data = {
    labels,
    datasets: [
      {
        label: 'Theft (High)',
        data: [3, 2, 4, 5, 3, 4, 2],
        borderColor: highSeverityColor,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Theft (Medium)',
        data: [5, 6, 7, 4, 6, 5, 4],
        borderColor: mediumSeverityColor,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Harassment (Medium)',
        data: [2, 3, 4, 2, 3, 2, 1],
        borderColor: mediumSeverityColor,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Lost Items (Low)',
        data: [8, 7, 9, 10, 8, 7, 6],
        borderColor: lowSeverityColor,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Medical (Medium)',
        data: [1, 2, 0, 3, 2, 1, 2],
        borderColor: mediumSeverityColor,
        borderDash: [10, 5],
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <Line options={options} data={data} />
    </div>
  );
};

export default IncidentAnalysisChart;