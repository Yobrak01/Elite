import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineList, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Planner = () => {
  const { user } = useAuth();
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/schedule');
        setAllSchedules(res.data);
        // Filter for today
        const today = new Date().toISOString().split('T')[0];
        const todaySched = res.data.filter(sch => {
          if (!sch.startDate) return false;
          const schDate = new Date(sch.startDate).toISOString().split('T')[0];
          return schDate === today;
        });
        setTodaySchedule(todaySched);
      } catch (err) {
        console.error('Failed to fetch schedules', err);
        toast.error('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      // In a real app, we would call an AI backend endpoint to generate a plan
      // For now, we'll simulate by creating some default schedules for today
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Clear existing today's schedules? Or add to them? We'll just add some.
      const newSchedules = [
        {
          title: 'Deep Work Session',
          description: 'Focus on most important task',
          startTime: '09:00',
          endTime: '11:00',
          isRecurring: false,
          startDate: today.toISOString().split('T')[0],
          type: 'study',
          color: '#3b82f6'
        },
        {
          title: 'Break / Recovery',
          description: 'Take a walk, stretch, hydrate',
          startTime: '11:00',
          endTime: '11:30',
          isRecurring: false,
          startDate: today.toISOString().split('T')[0],
          type: 'break',
          color: '#10b981'
        },
        {
          title: 'Review and Practice',
          description: 'Review what you learned and practice problems',
          startTime: '13:00',
          endTime: '15:00',
          isRecurring: false,
          startDate: today.toISOString().split('T')[0],
          type: 'study',
          color: '#3b82f6'
        },
        {
          title: 'Exercise / Gym',
          description: 'Physical activity to boost energy',
          startTime: '16:00',
          endTime: '17:00',
          isRecurring: false,
          startDate: today.toISOString().split('T')[0],
          type: 'gym',
          color: '#f59e0b'
        }
      ];

      // Add these schedules
      for (const sched of newSchedules) {
        await axios.post('/api/schedule', sched);
      }

      // Refresh schedules
      const res = await axios.get('/api/schedule');
      setAllSchedules(res.data);
      const todaySched = res.data.filter(sch => {
        if (!sch.startDate) return false;
        const schDate = new Date(sch.startDate).toISOString().split('T')[0];
        return schDate === today.toISOString().split('T')[0];
      });
      setTodaySchedule(todaySched);

      toast.success('Daily plan generated!');
    } catch (err) {
      console.error('Failed to generate plan', err);
      toast.error('Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    // We'll implement a form to add schedule, but for brevity, we'll skip and just show a toast
    toast.info('Schedule form would go here');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-blue-800">
          AI Daily Planner
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePlan}
            disabled={generating}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ${generating ? 'cursor-not-allowed' : ''}`}
          >
            {generating ? 'Generating...' : 'Generate Today\'s Plan'}
             <HiOutlineSun className="ml-2" />
          </button>
          <button
            onClick={handleAddSchedule}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Add Schedule
            <HiOutlinePlus className="ml-2" />
          </button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Today's Schedule
        </h2>
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : todaySchedule.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No schedules for today. Generate a plan or add schedules.
          </p>
        ) : (
          <div className="space-y-4">
            {todaySchedule.map(sch => (
              <div key={sch._id} className="flex items-start space-x-4 p-4 border-l-4 border-blue-500 bg-gray-50">
                <div className="flex-shrink-0">
                  <HiOutlineClock className="mt-1 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {sch.title}
                  </h3>
                  <p className="text-gray-600">{sch.description}</p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span>
                      {sch.startTime} - {sch.endTime}
                    </span>
                    <span className="ml-auto">
                      <span className={`px-2 py-0.5 rounded text-xs
                        ${sch.type === 'study' ? 'bg-blue-100 text-blue-800' :
                          sch.type === 'break' ? 'bg-green-100 text-green-800' :
                            sch.type === 'gym' ? 'bg-yellow-100 text-yellow-800' :
                              sch.type === 'exam' ? 'bg-red-100 text-red-800' :
                                sch.type === 'church' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {sch.type}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Schedules */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          All Schedules
        </h2>
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : allSchedules.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No schedules yet.
          </p>
        ) : (
          <div className="space-y-4">
            {allSchedules.map(sch => (
              <div key={sch._id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <HiOutlineCalendar className="mt-1 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {sch.title}
                  </h3>
                  <p className="text-gray-600">{sch.description}</p>
                  <div className="flex flex-wrap items-center space-x-3 text-sm text-gray-500">
                    <span>
                      {sch.startTime} - {sch.endTime}
                    </span>
                    <span>
                      {sch.startDate ? new Date(sch.startDate).toLocaleDateString() : 'No date'}
                    </span>
                    <span className="ml-auto">
                      <span className={`px-2 py-0.5 rounded text-xs
                        ${sch.type === 'study' ? 'bg-blue-100 text-blue-800' :
                          sch.type === 'break' ? 'bg-green-100 text-green-800' :
                            sch.type === 'gym' ? 'bg-yellow-100 text-yellow-800' :
                              sch.type === 'exam' ? 'bg-red-100 text-red-800' :
                                sch.type === 'church' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {sch.type}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;