import React, { useState, useEffect } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/solid';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Crud() {
  const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
    console.log('✨ AOS initialized');
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('💾 Users saved to localStorage:', users);
  }, [users]);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    console.log(`✍️ Input changed: ${e.target.name} = ${e.target.value}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, username, password } = formData;

    if (!name || !email || !username || !password) {
      toast.error('All fields are required.');
      console.warn('⚠️ Submission failed: Missing fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn('Invalid email format.');
      console.warn('📛 Invalid email format submitted:', email);
      return;
    }

    if (editingIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = formData;
      setUsers(updatedUsers);
      toast.success('User updated.');
      console.log('✏️ User updated at index', editingIndex, ':', formData);
      setEditingIndex(null);
    } else {
      setUsers([...users, formData]);
      toast.success('New user added.');
      console.log('➕ New user added:', formData);
    }

    setFormData({ name: '', email: '', username: '', password: '' });
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditingIndex(index);
    setShowPassword(false);
    console.log('🛠️ Editing user at index', index, ':', users[index]);
  };

  const handleDelete = (index) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) {
      console.log('❌ Delete cancelled');
      return;
    }

    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    toast.info('User deleted.');
    console.log('🗑️ User deleted at index', index);

    if (editingIndex === index) {
      setFormData({ name: '', email: '', username: '', password: '' });
      setEditingIndex(null);
    }
  };

  const handleClearAll = () => {
    const confirm = window.confirm('Are you sure you want to clear all users?');
    if (!confirm) {
      console.log('🚫 Clear all cancelled');
      return;
    }

    localStorage.removeItem('users');
    setUsers([]);
    setFormData({ name: '', email: '', username: '', password: '' });
    setEditingIndex(null);
    toast.warn('All users cleared.');
    console.log('🧹 All users cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-200 p-6 sm:p-10">
      <ToastContainer />
      <div className="max-w-3xl mx-auto backdrop-blur-md p-6 sm:p-10" data-aos="fade-up">
        
        {/* Alert Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              const nextState = !showAlert;
              setShowAlert(nextState);
              toast[nextState ? 'warn' : ''](
                nextState
                  ? 'This app stores user data in your browser using localStorage. Do not enter real credentials.'
                  : '.'
              );
              console.log(`⚠️ Alert state: ${nextState ? 'shown' : 'hidden'}`);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-red-800 hover:bg-red-100 shadow-sm transition"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </button>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8">
          {editingIndex !== null ? 'Edit User' : 'Add User'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" data-aos="fade-up">
          {['name', 'email', 'username'].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="mb-1 font-semibold text-gray-700 capitalize">
                {field}
              </label>
              <input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
              />
            </div>
          ))}

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-1 font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="border border-gray-300 px-4 py-2 pr-10 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600 transition"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 text-white text-base font-semibold rounded-xl shadow-lg transition active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
              ${editingIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <UserPlusIcon className="w-5 h-5" />
            {editingIndex !== null ? 'Update User' : 'Add User'}
          </button>
        </form>

        {/* User List */}
        <hr className="my-10 border-gray-300" />
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6" data-aos="fade-up">
          User List
        </h3>

        {users.length === 0 ? (
          <div className="text-center text-gray-400 py-10" data-aos="fade-up">
            <p>No users added yet.</p>
            <p className="text-sm">Fill out the form above to get started.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={index}
                className="bg-[#c0dbff] bg-opacity-70 p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-500">Username: {user.username}</p>
                  <p className="text-sm text-gray-400">
                    Password: <span className="blur-sm hover:blur-none transition">{user.password}</span>
                  </p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {users.length > 0 && (
          <button
            onClick={handleClearAll}
            className="mt-8 w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition active:scale-95"
            data-aos="fade-up"
            data-aos-delay="300"
          >
           🧹 Clear All Users
          </button>
        )}
      </div>
    </div>
  );
}

export default Crud;
