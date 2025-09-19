import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, AlertTriangle, Clock, MapPin, Layers } from 'lucide-react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

const PoliceAnalytics: React.FC = () => {
  const touristFlowChartRef = useRef<HTMLCanvasElement | null>(null);
  const incidentChartRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize charts when component mounts
  useEffect(() => {
    let touristFlowChart: Chart | null = null;
    let incidentChart: Chart | null = null;
    
    if (touristFlowChartRef.current) {
      const ctx = touristFlowChartRef.current.getContext('2d');
      if (ctx) {
        touristFlowChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Shillong',
                data: [120, 145, 132, 165, 178, 210, 190],
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
              },
              {
                label: 'Gangtok',
                data: [85, 90, 105, 115, 110, 140, 125],
                borderColor: 'rgba(124, 58, 237, 1)',
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
              },
              {
                label: 'Guwahati',
                data: [65, 78, 92, 86, 95, 110, 105],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'rgba(255, 255, 255, 0.8)',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: {
                  family: "'Inter', sans-serif",
                  size: 14
                },
                bodyFont: {
                  family: "'Inter', sans-serif",
                  size: 13
                },
                borderColor: 'rgba(75, 85, 99, 1)',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              },
              x: {
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              }
            }
          }
        });
      }
    }
    
    if (incidentChartRef.current) {
      const ctx = incidentChartRef.current.getContext('2d');
      if (ctx) {
        incidentChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Theft', 'Harassment', 'Lost Tourist', 'Medical', 'Scams', 'Accidents'],
            datasets: [
              {
                label: 'This Month',
                data: [23, 17, 35, 12, 8, 15],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1
              },
              {
                label: 'Last Month',
                data: [28, 21, 42, 15, 14, 19],
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            animation: {
              duration: 2000,
              easing: 'easeOutBounce'
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'rgba(255, 255, 255, 0.8)',
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleFont: {
                  family: "'Inter', sans-serif",
                  size: 14
                },
                bodyFont: {
                  family: "'Inter', sans-serif",
                  size: 13
                },
                borderColor: 'rgba(75, 85, 99, 1)',
                borderWidth: 1
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              },
              x: {
                grid: {
                  color: 'rgba(75, 85, 99, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    family: "'Inter', sans-serif"
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Cleanup on component unmount
    return () => {
      touristFlowChart?.destroy();
      incidentChart?.destroy();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        duration: 0.5 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
      {/* Header with glowing border */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/60 backdrop-blur-sm border-b border-blue-500/30 px-6 py-4 sticky top-0 z-10 shadow-lg"
        style={{ boxShadow: '0 4px 30px rgba(59, 130, 246, 0.15)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <span>Analytics Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-1">Tourist safety insights and trends</p>
          </div>
          <Link 
            to="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      <div className="px-6 py-6">
        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-blue-500/20 shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:translate-y-[-5px]"
            style={{ boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)' }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-full shadow-md shadow-blue-600/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-gray-400 text-sm">Total Tourists</div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">+15% this month</span>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-emerald-500/20 shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 hover:translate-y-[-5px]"
            style={{ boxShadow: '0 8px 20px rgba(16, 185, 129, 0.1)' }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-3 rounded-full shadow-md shadow-emerald-600/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">96.2%</div>
                <div className="text-gray-400 text-sm">Safety Score</div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Above target</span>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-yellow-500/20 shadow-lg hover:shadow-yellow-900/20 transition-all duration-300 hover:translate-y-[-5px]"
            style={{ boxShadow: '0 8px 20px rgba(202, 138, 4, 0.1)' }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-3 rounded-full shadow-md shadow-yellow-600/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">23</div>
                <div className="text-gray-400 text-sm">Active Alerts</div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">-12% from yesterday</span>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-purple-500/20 shadow-lg hover:shadow-purple-900/20 transition-all duration-300 hover:translate-y-[-5px]"
            style={{ boxShadow: '0 8px 20px rgba(126, 34, 206, 0.1)' }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-full shadow-md shadow-purple-600/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">1.8min</div>
                <div className="text-gray-400 text-sm">Avg Response</div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Improved 23%</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts with real data */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-filter backdrop-blur-sm rounded-lg border border-blue-500/20 shadow-xl hover:shadow-blue-900/20 transition-all duration-300">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>Tourist Flow Trends</span>
              </h3>
              <div className="bg-gray-900/50 px-3 py-1 rounded-full text-xs text-gray-400">
                Last 7 days
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <canvas ref={touristFlowChartRef} height="280"></canvas>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-filter backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-xl hover:shadow-purple-900/20 transition-all duration-300">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
                <span>Incident Analysis</span>
              </h3>
              <div className="bg-gray-900/50 px-3 py-1 rounded-full text-xs text-gray-400">
                Monthly comparison
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <canvas ref={incidentChartRef} height="280"></canvas>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Regional Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg border border-indigo-500/20 shadow-xl"
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Regional Safety Statistics</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { region: 'Shillong, Meghalaya', tourists: 234, safety: 94, incidents: 2 },
                { region: 'Gangtok, Sikkim', tourists: 189, safety: 97, incidents: 1 },
                { region: 'Guwahati, Assam', tourists: 156, safety: 91, incidents: 4 },
                { region: 'Imphal, Manipur', tourists: 89, safety: 96, incidents: 1 },
                { region: 'Kohima, Nagaland', tourists: 67, safety: 98, incidents: 0 },
                { region: 'Itanagar, Arunachal Pradesh', tourists: 45, safety: 93, incidents: 2 }
              ].map((region, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(30, 64, 175, 0.2)' }}
                  className="bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-lg p-5 border border-gray-700/50 shadow-md transition-all duration-300"
                >
                  <h4 className="font-semibold mb-3 text-indigo-300">{region.region}</h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Active Tourists:</span>
                        <span className="font-medium">{region.tourists}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(region.tourists/234)*100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Safety Score:</span>
                        <span className={`font-medium ${
                          region.safety >= 95 ? 'text-emerald-400' :
                          region.safety >= 90 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{region.safety}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className={`${
                          region.safety >= 95 ? 'bg-emerald-500' :
                          region.safety >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        } h-1.5 rounded-full`} style={{ width: `${region.safety}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Active Incidents:</span>
                        <span className={`font-medium ${
                          region.incidents === 0 ? 'text-emerald-400' :
                          region.incidents <= 2 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{region.incidents}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className={`${
                          region.incidents === 0 ? 'bg-emerald-500' :
                          region.incidents <= 2 ? 'bg-yellow-500' : 'bg-red-500'
                        } h-1.5 rounded-full`} style={{ width: `${(region.incidents/4)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PoliceAnalytics;