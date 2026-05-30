import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedHours: 1,
    deadline: '',
    type: 'theory',
    subject: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        toast.error('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask({
      ...newTask,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/tasks', newTask);
      setTasks([res.data, ...tasks]);
      // Reset form
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        estimatedHours: 1,
        deadline: '',
        type: 'theory',
        subject: ''
      });
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/complete`);
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      type: task.type,
      subject: task.subject || ''
    });
  };

  const saveEdit = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, editForm);
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, ...editForm } : task
      ));
      setEditingId(null);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
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
          Task Management
        </h1>
        <button
          onClick={() => setEditingId(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <HiOutlinePlus className="mr-2" /> Add Task
        </button>
      </div>

      {/* Task Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingId ? 'Edit Task' : 'Add New Task'}
        </h2>
        <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(editingId); } : handleSubmit}
              className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingId ? editForm.title : newTask.title}
                onChange={editingId ? (e) => setEditForm({...editForm, title: e.target.value}) : handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-1 text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={editingId ? editForm.subject : newTask.subject}
                onChange={editingId ? (e) => setEditForm({...editForm, subject: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={editingId ? editForm.description : newTask.description}
              onChange={editingId ? (e) => setEditForm({...editForm, description: e.target.value}) : handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="priority" className="block mb-1 text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={editingId ? editForm.priority : newTask.priority}
                onChange={editingId ? (e) => setEditForm({...editForm, priority: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="estimatedHours" className="block mb-1 text-sm font-medium text-gray-700">
                Estimated Hours
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                min="1"
                value={editingId ? editForm.estimatedHours : newTask.estimatedHours}
                onChange={editingId ? (e) => setEditForm({...editForm, estimatedHours: Number(e.target.value)}) : handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block mb-1 text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={editingId ? editForm.deadline : newTask.deadline}
                onChange={editingId ? (e) => setEditForm({...editForm, deadline: e.target.value}) : handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="type" className="text-sm font-medium text-gray-700">
              Task Type
            </label>
            <select
              id="type"
              name="type"
              value={editingId ? editForm.type : newTask.type}
              onChange={editingId ? (e) => setEditForm({...editForm, type: e.target.value}) : handleChange}
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="theory">Theory</option>
              <option value="procedural">Procedural</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onCancel={cancelEdit}
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
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Your Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No tasks yet. Add a new task to get started!
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map(task => (
              <li key={task._id} className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="flex-1 font-semibold text-gray-800">
                      {task.title}
                      {task.subject && <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">{task.subject}</span>}
                    </h3>
                    <span className={`
                      px-2 py-0.5 rounded text-xs
                      ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                    `}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">{task.description || 'No description'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      <HiOutlineClock className="mr-1" /> {task.estimatedHours} hrs
                    </span>
                    <span>
                      <HiOutlineCheckCircle className="mr-1 text-green-500" />
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                    <span className="ml-auto">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Tasks;