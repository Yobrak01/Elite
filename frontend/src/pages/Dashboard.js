import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlineChartPie, HiOutlineClock, HiOutlineBadgeCheck, HiOutlineHeart } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:space-x-4">
        {/* Welcome */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your overview for today. Stay focused and crush your goals.
          </p>
        </div>
        {/* Quick Stats */}
        {analytics && (
          <div className="flex-1 space-y-4">
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
      </div>

      {/* AI Recommendations and Streak */}
      {analytics && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              AI Recommendations
            </h2>
            <ul className="space-y-2">
              {analytics.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-gray-700">
                  <span className="flex-shrink-0 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Your Streak
            </h2>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                {analytics.streak}
              </p>
              <p className="text-gray-600">days</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Analytics Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          Weekly Study Trends
        </h2>
        <div className="h-96 bg-gray-100 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Chart would go here (using a library like Chart.js or Recharts)</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;