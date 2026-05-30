import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlineChartPie, HiOutlineClock, HiOutlineBadgeCheck, HiOutlineHeart } from 'react-icons/hi';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, weeklyRes] = await Promise.all([
          axios.get('/api/analytics'),
          axios.get('/api/analytics/weekly')
        ]);
        setAnalytics(analyticsRes.data);
        setWeekly(weeklyRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">
        Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
            <HiOutlineClock className="text-blue-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-gray-800">Study Hours</h3>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.totalStudyHours} hrs
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
            <HiOutlineBadgeCheck className="text-green-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-gray-800">Completion Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                {analytics.completionPercentage}%
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
            <HiOutlineChartPie className="text-purple-500 text-2xl" />
            <div>
              <h3 className="font-semibold text-gray-800">Focus Score</h3>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.focusScore}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3">
            <HiOutlineHeart className={`
              ${analytics.burnoutRisk === 'High' ? 'text-red-500' :
                analytics.burnoutRisk === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}
                text-2xl
              `} />
            <div>
              <h3 className="font-semibold text-gray-800">Burnout Risk</h3>
              <p className="text-2xl font-bold">
                {analytics.burnoutRisk}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Charts Placeholder */}
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-bold text-blue-800 mb-4">
             Study Hours Trend (Last 7 Days)
           </h2>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Bar chart for study hours per day</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            Focus Score Trend (Last 7 Days)
          </h2>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Line chart for focus score per day</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {analytics && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            Detailed Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Average Focus Score:</span>
              <span className="font-medium">{analytics.averageFocusScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Productivity Score:</span>
              <span className="font-medium">{analytics.productivityScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Streak:</span>
              <span className="font-medium">{analytics.streak} days</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">
              AI Recommendations
            </h3>
            <ul className="space-y-1">
              {analytics.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-gray-700">
                  <span className="flex-shrink-0 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;