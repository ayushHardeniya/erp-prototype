import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, subDays } from 'date-fns';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import {
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  UserGroupIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const { user, userRole, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    attendance: 0,
    events: 0,
    assignments: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, fetch data from Supabase here
        // For demo purposes, use mock data
        setStats({
          students: 1572,
          attendance: 97,
          events: 12,
          assignments: 8
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // Get the last 7 days for chart labels
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    return format(subDays(new Date(), i), 'EEE');
  }).reverse();

  // Attendance data for the chart
  const attendanceData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Attendance Rate',
        data: [95, 93, 97, 96, 98, 91, 94],
        fill: true,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: 'rgba(79, 70, 229, 0.8)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
      },
    ],
  };

  // Gender distribution data
  const genderDistributionData = {
    labels: ['Male', 'Female', 'Others'],
    datasets: [
      {
        data: [850, 682, 40],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(167, 139, 250, 0.8)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(167, 139, 250, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Performance data by subject
  const performanceData = {
    labels: ['Mathematics', 'Science', 'English', 'History', 'Computer'],
    datasets: [
      {
        label: 'Average Score',
        data: [85, 78, 92, 88, 95],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderRadius: 6,
      },
    ],
  };
  
  // Quick access menu items based on role
  const quickAccessItems = () => {
    const commonItems = [
      {
        title: 'Attendance',
        icon: AcademicCapIcon,
        link: '/attendance',
        color: 'bg-blue-100 text-blue-700',
      },
      {
        title: 'Timetable',
        icon: CalendarIcon,
        link: '/timetable',
        color: 'bg-indigo-100 text-indigo-700',
      },
      {
        title: 'Library',
        icon: BookOpenIcon,
        link: '/library',
        color: 'bg-green-100 text-green-700',
      },
      {
        title: 'Notifications',
        icon: BellIcon,
        link: '/notifications',
        color: 'bg-yellow-100 text-yellow-700',
      },
    ];
    
    if (userRole === 'admin' || userRole === 'faculty') {
      return [
        ...commonItems,
        {
          title: 'Students',
          icon: UserGroupIcon,
          link: '/students',
          color: 'bg-purple-100 text-purple-700',
        },
        {
          title: 'Exams',
          icon: ClipboardDocumentListIcon,
          link: '/exams-results',
          color: 'bg-red-100 text-red-700',
        },
      ];
    }
    
    return [
      ...commonItems,
      {
        title: 'Fees',
        icon: CurrencyRupeeIcon,
        link: '/fees-payments',
        color: 'bg-pink-100 text-pink-700',
      },
      {
        title: 'Transport',
        icon: TruckIcon,
        link: '/transport',
        color: 'bg-orange-100 text-orange-700',
      },
    ];
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div>
      {/* Welcome header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {getGreeting()}, {userProfile?.fullName || user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your dashboard. Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats overview */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-50">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Students</h2>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.students.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Attendance Rate</h2>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.attendance}%</p>
                <span className="ml-2 text-sm text-green-600">+2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-50">
              <CalendarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Upcoming Events</h2>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.events}</p>
                <span className="ml-2 text-sm text-yellow-600">This month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-pink-50">
              <ClipboardDocumentListIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Pending Tasks</h2>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.assignments}</p>
                <span className="ml-2 text-sm text-red-600">Due soon</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts and data section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance chart */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Attendance</h2>
          <div className="h-64">
            <Line 
              data={attendanceData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: 'rgba(79, 70, 229, 0.9)',
                    titleFont: {
                      size: 13,
                    },
                    bodyFont: {
                      size: 13,
                    },
                    padding: 10,
                    cornerRadius: 6,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                    grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  }
                },
                maintainAspectRatio: false,
                elements: {
                  point: {
                    radius: 4,
                    hoverRadius: 6,
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Gender distribution */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Distribution</h2>
          <div className="h-64">
            <Doughnut 
              data={genderDistributionData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12,
                      },
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    titleFont: {
                      size: 13,
                    },
                    bodyFont: {
                      size: 13,
                    },
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.formattedValue || '';
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = Math.round((context.raw / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
                maintainAspectRatio: false,
                cutout: '65%',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick Access and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick access */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickAccessItems().map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className={`flex flex-col items-center p-4 rounded-xl ${item.color} transition-all duration-200 hover:shadow-md`}
              >
                <item.icon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">{item.title}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <AcademicCapIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Attendance Marked</p>
                  <p className="text-xs text-gray-500">{format(new Date(), 'MMM dd, h:mm a')}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">Attendance</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Assignment Submitted</p>
                  <p className="text-xs text-gray-500">{format(subDays(new Date(), 1), 'MMM dd, h:mm a')}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Academics</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <CurrencyRupeeIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Fees Payment Processed</p>
                  <p className="text-xs text-gray-500">{format(subDays(new Date(), 2), 'MMM dd, h:mm a')}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Finance</span>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <BellIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New Announcement</p>
                  <p className="text-xs text-gray-500">{format(subDays(new Date(), 3), 'MMM dd, h:mm a')}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">Notification</span>
            </li>
          </ul>
          <div className="mt-4 text-center">
            <Link to="/notifications" className="text-sm text-primary-600 font-medium hover:text-primary-500">
              View all activities
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
