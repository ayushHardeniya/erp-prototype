import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';
import { auth } from '../config/supabase';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { session } = await auth.getSession();
        if (session?.user) {
          setUserData({
            name: session.user.user_metadata?.full_name || session.user.email,
            role: session.user.user_metadata?.role || 'User',
            avatar: session.user.user_metadata?.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [95, 93, 97, 96, 98, 91, 94],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  const genderDistributionData = {
    labels: ['Male', 'Female', 'Others'],
    datasets: [
      {
        data: [850, 600, 50],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(236, 72, 153)',
          'rgb(167, 139, 250)',
        ],
      },
    ],
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-primary-700">
          Welcome {userData?.name || 'User'}!
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg text-gray-600">Role: {userData?.role || 'User'}</span>
          <img 
            src={userData?.avatar || '/default-avatar.png'} 
            alt="User Avatar" 
            className="w-12 h-12 rounded-full border-2 border-primary-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-card rounded-xl p-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">1500</span>
            <span className="text-gray-500">Total Students</span>
          </div>
          <div className="mt-4 h-32">
            <Doughnut 
              data={genderDistributionData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div className="bg-white shadow-card rounded-xl p-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">98%</span>
            <span className="text-gray-500">Attendance Rate</span>
          </div>
          <div className="mt-4 h-32">
            <Line 
              data={attendanceData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 80,
                    max: 100,
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div className="bg-white shadow-card rounded-xl p-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">12</span>
            <span className="text-gray-500">Upcoming Events</span>
          </div>
          <div className="mt-4">
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                <span className="font-semibold">Sep 25:</span> Annual Sports Day
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-semibold">Sep 27:</span> Parent-Teacher Meeting
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-semibold">Sep 30:</span> Mid-Term Exams
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between items-center text-gray-700">
              <div>
                <p>Student John Doe marked present</p>
                <span className="text-sm text-gray-500">{format(new Date(), 'MMM dd, HH:mm')}</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Attendance</span>
            </li>
            <li className="py-2 flex justify-between items-center text-gray-700">
              <div>
                <p>Library book issued to Jane Smith</p>
                <span className="text-sm text-gray-500">{format(new Date(), 'MMM dd, HH:mm')}</span>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Library</span>
            </li>
            <li className="py-2 flex justify-between items-center text-gray-700">
              <div>
                <p>Fee payment received from Rahul</p>
                <span className="text-sm text-gray-500">{format(new Date(), 'MMM dd, HH:mm')}</span>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Payments</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-primary-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              <span className="block text-primary-700 font-semibold">Take Attendance</span>
              <span className="text-sm text-gray-600">Mark student attendance</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
              <span className="block text-green-700 font-semibold">Add Student</span>
              <span className="text-sm text-gray-600">Register new student</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
              <span className="block text-purple-700 font-semibold">Issue Book</span>
              <span className="text-sm text-gray-600">Library management</span>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors">
              <span className="block text-orange-700 font-semibold">Send Notice</span>
              <span className="text-sm text-gray-600">Broadcast announcement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
