import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateMetrics } = useAuth(); // We'll update metrics via context, but we'll also use axios directly for other calls
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    major: user?.major || '',
    currentSemester: user?.currentSemester || 1,
    gpa: user?.gpa || 0
  });
  const [modeData, setModeData] = useState({
    currentMode: user?.currentMode || 'Normal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        major: user.major || '',
        currentSemester: user.currentSemester || 1,
        gpa: user.gpa || 0
      });
      setModeData({
        currentMode: user.currentMode || 'Normal'
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value, type } = e.target;
    setProfileData({
      ...profileData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleModeChange = (e) => {
    const { name, value } = e.target;
    setModeData({
      ...modeData,
      [name]: value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/user/profile', profileData);
      // Also update the user in context? We'll rely on the auth context to fetch updated user on next check.
      // For now, we'll just show a toast and refetch the user by triggering a re-login? 
      // Simpler: we'll update the local state and show success.
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleModeUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/user/mode', modeData);
      toast.success('Mode updated successfully');
    } catch (err) {
      toast.error('Failed to update mode: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">
        Settings
      </h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Profile Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="major" className="block mb-1 text-sm font-medium text-gray-700">
                Major
              </label>
              <input
                type="text"
                id="major"
                name="major"
                value={profileData.major}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="currentSemester" className="block mb-1 text-sm font-medium text-gray-700">
                Current Semester
              </label>
              <input
                type="number"
                id="currentSemester"
                name="currentSemester"
                min="1"
                value={profileData.currentSemester}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="gpa" className="block mb-1 text-sm font-medium text-gray-700">
              GPA (out of 4.0)
            </label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              min="0"
              max="4"
              step="0.01"
              value={profileData.gpa}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Mode Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Study Mode
        </h2>
        <p className="text-gray-600 mb-4">
          Select your current study mode to adjust scheduling and recommendations.
        </p>
        <form onSubmit={handleModeUpdate} className="space-y-4">
          <div>
            <label htmlFor="currentMode" className="block mb-2 text-sm font-medium text-gray-700">
              Current Mode
            </label>
            <select
              id="currentMode"
              name="currentMode"
              value={modeData.currentMode}
              onChange={handleModeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal Mode</option>
              <option value="CAT Preparation">CAT Preparation Mode</option>
              <option value="Exam Preparation">Exam Preparation Mode</option>
              <option value="Recovery">Recovery Mode</option>
              <option value="Unexpected Event">Unexpected Event Mode</option>
            </select>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">
              Mode Descriptions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Normal Mode:</strong> Regular study schedule with balanced workload.
              </li>
              <li>
                <strong>CAT Preparation Mode:</strong> Increased focus on CAT exams, more practice tests.
              </li>
              <li>
                <strong>Exam Preparation Mode:</strong> Intensive review for upcoming exams.
              </li>
              <li>
                <strong>Recovery Mode:</strong> Reduced workload to prevent burnout.
              </li>
              <li>
                <strong>Unexpected Event Mode:</strong> Flexible schedule to accommodate disruptions.
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Mode'}
          </button>
        </form>
      </div>

      {/* Metrics Section (Read-only, showing current stats) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Current Metrics
        </h2>
        {/* We would fetch fresh analytics here, but for now we'll show what we have from user */}
        <p className="text-gray-500">
          Metrics are updated automatically based on your activity. Visit the Analytics page for detailed insights.
        </p>
      </div>
    </div>
  );
};

export default Settings;