import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlineCalendar, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Schedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    isRecurring: false,
    recurrencePattern: 'none',
    daysOfWeek: [],
    startDate: '',
    endDate: '',
    type: 'study',
    color: '#3b82f6'
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/schedule');
        setSchedules(res.data);
      } catch (err) {
        console.error('Failed to fetch schedules', err);
        toast.error('Failed to load schedules');
      }
    };

    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSchedule({
      ...newSchedule,
      [name]: type === 'checkbox' ? checked : type === 'select-one' ? value : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/schedule', newSchedule);
      setSchedules([res.data, ...schedules]);
      // Reset form
      setNewSchedule({
        title: '',
        description: '',
        startTime: '09:00',
        endTime: '10:00',
        isRecurring: false,
        recurrencePattern: 'none',
        daysOfWeek: [],
        startDate: '',
        endDate: '',
        type: 'study',
        color: '#3b82f6'
      });
      toast.success('Schedule created successfully');
    } catch (err) {
      toast.error('Failed to create schedule: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await axios.delete(`/api/schedule/${scheduleId}`);
      setSchedules(schedules.filter(sch => sch._id !== scheduleId));
      toast.success('Schedule deleted');
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
  };

  const startEditing = (schedule) => {
    setEditingId(schedule._id);
    setEditForm({
      title: schedule.title,
      description: schedule.description || '',
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isRecurring: schedule.isRecurring,
      recurrencePattern: schedule.recurrencePattern,
      daysOfWeek: schedule.daysOfWeek || [],
      startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : '',
      endDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : '',
      type: schedule.type,
      color: schedule.color
    });
  };

  const saveEdit = async (scheduleId) => {
    try {
      await axios.put(`/api/schedule/${scheduleId}`, editForm);
      setSchedules(schedules.map(sch =>
        sch._id === scheduleId ? { ...sch, ...editForm } : sch
      ));
      setEditingId(null);
      toast.success('Schedule updated');
    } catch (err) {
      toast.error('Failed to update schedule');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-blue-800">
          Schedule Management
        </h1>
        <button
          onClick={() => setEditingId(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <HiOutlinePlus className="mr-2" /> Add Schedule
        </button>
      </div>

      {/* Schedule Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? 'Edit Schedule' : 'Add New Schedule'}
        </h2>
        <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(editingId); } : handleSubmit}
              className="space-y-4"
        >
          <div>
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={editingId ? editForm.title : newSchedule.title}
              onChange={editingId ? (e) => setEditForm({...editForm, title: e.target.value}) : handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={editingId ? editForm.description : newSchedule.description}
              onChange={editingId ? (e) => setEditForm({...editForm, description: e.target.value}) : handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block mb-1 text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={editingId ? editForm.startTime : newSchedule.startTime}
                onChange={editingId ? (e) => setEditForm({...editForm, startTime: e.target.value}) : handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block mb-1 text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={editingId ? editForm.endTime : newSchedule.endTime}
                onChange={editingId ? (e) => setEditForm({...editForm, endTime: e.target.value}) : handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isRecurring" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                Recurring
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={editingId ? editForm.isRecurring : newSchedule.isRecurring}
                  onChange={editingId ? (e) => setEditForm({...editForm, isRecurring: e.target.checked}) : handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
            <div>
              <label htmlFor="recurrencePattern" className="block mb-1 text-sm font-medium text-gray-700">
                Recurrence Pattern
              </label>
              <select
                id="recurrencePattern"
                name="recurrencePattern"
                value={editingId ? editForm.recurrencePattern : newSchedule.recurrencePattern}
                onChange={editingId ? (e) => setEditForm({...editForm, recurrencePattern: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!((editingId ? editForm.isRecurring : newSchedule.isRecurring))}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Days of week for weekly recurrence */}
          {((editingId ? editForm.isRecurring && editForm.recurrencePattern === 'weekly' : newSchedule.isRecurring && newSchedule.recurrencePattern === 'weekly')) && (
            <div className="mt-4">
              <label htmlFor="daysOfWeek" className="block mb-2 text-sm font-medium text-gray-700">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {[0,1,2,3,4,5,6].map(day => {
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const isChecked = (editingId ? editForm.daysOfWeek : newSchedule.daysOfWeek).includes(day);
                  return (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={day}
                        checked={isChecked}
                         onChange={editingId ? (e) => {
                           const days = editingId ? [...editForm.daysOfWeek] : [...newSchedule.daysOfWeek];
                           const index = days.indexOf(day);
                           if (e.target.checked) {
                             if (index === -1) days.push(day);
                           } else {
                             if (index !== -1) days.splice(index, 1);
                           }
                           if (editingId) setEditForm({...editForm, daysOfWeek: days});
                           else setNewSchedule({...newSchedule, daysOfWeek: days});
                         }}
                         className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{dayNames[day]}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block mb-1 text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={editingId ? editForm.startDate : newSchedule.startDate}
                onChange={editingId ? (e) => setEditForm({...editForm, startDate: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block mb-1 text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={editingId ? editForm.endDate : newSchedule.endDate}
                onChange={editingId ? (e) => setEditForm({...editForm, endDate: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block mb-1 text-sm font-medium text-gray-700">
              Schedule Type
            </label>
            <select
              id="type"
              name="type"
              value={editingId ? editForm.type : newSchedule.type}
              onChange={editingId ? (e) => setEditForm({...editForm, type: e.target.value}) : handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="study">Study</option>
              <option value="lecture">Lecture</option>
              <option value="gym">Gym</option>
              <option value="exam">Exam</option>
              <option value="church">Church</option>
              <option value="personal">Personal</option>
              <option value="break">Break</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="color" className="block mb-1 text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="color"
              id="color"
              name="color"
              value={editingId ? editForm.color : newSchedule.color}
              onChange={editingId ? (e) => setEditForm({...editForm, color: e.target.value}) : handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {editingId ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* Schedules List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your Schedules
        </h2>
        {schedules.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No schedules yet. Add a new schedule to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {schedules.map(sch => (
              <div key={sch._id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <HiOutlineCalendar className="mt-1 text-blue-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="flex-1 font-semibold text-gray-800">
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
                    {sch.isRecurring && (
                      <span>
                        {sch.recurrencePattern === 'daily' ? 'Daily' :
                          sch.recurrencePattern === 'weekly' ? 'Weekly' :
                            sch.recurrencePattern === 'monthly' ? 'Monthly' : 'None'}
                      </span>
                    )}
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
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => startEditing(sch)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sch._id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Delete
                    </button>
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

export default Schedule;