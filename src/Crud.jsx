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
  const [visiblePasswordIndex, setVisiblePasswordIndex] = useState(null);

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
    <div className="min-h-screen md:p-10">
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8" data-aos="fade-down">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">🔧 Credentials Manager</h1>
          <button
            onClick={() => {
              const nextState = !showAlert;
              setShowAlert(nextState);
              if (nextState) {
                toast.warn('This app stores user data in your browser. Don’t use real credentials!');
              }
              console.log(`⚠️ Alert toggled: ${nextState ? 'shown' : 'hidden'}`);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-800 hover:bg-red-100 rounded-full shadow"
            data-aos="fade-left"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="bg-transparent p-6 col-span-1 w-full" data-aos="fade-right">
            <h2 className="text-xl font-semibold mb-4 text-indigo-800">
              {editingIndex !== null ? '✏️ Edit Credential' : ' Add New Credential'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'username'].map((field, i) => (
                <div key={field} data-aos="fade-up" data-aos-delay={i * 100}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">{field}</label>
                  <input
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-400 focus:ring-2"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}

              <div className="relative" data-aos="fade-up" data-aos-delay="300">
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 pr-10 border rounded-lg shadow-sm focus:ring-indigo-400 focus:ring-2"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${
                  editingIndex !== null
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                {editingIndex !== null ? 'Update User' : 'Add User'}
              </button>
            </form>
          </div>

          {/* User List - Vertical */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6" data-aos="fade-left">
              👥 Credential List
            </h3>

            {users.length === 0 ? (
              <div className="text-center text-gray-500 mt-10" data-aos="fade-up">
                No credentials found. Add some!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6" data-aos="fade-up">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="bg-transparent border border-indigo-100 rounded-xl p-5 shadow hover:shadow-xl transition"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <p>👤 {user.username}</p>
                      <p
                        className="cursor-pointer select-none"
                        onClick={() =>
                          setVisiblePasswordIndex(visiblePasswordIndex === index ? null : index)
                        }
                        title="Click to toggle password"
                      >
                        🔒{' '}
                        <span className={`transition ${visiblePasswordIndex === index ? '' : 'blur-sm'}`}>
                          {user.password}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow transition"
                        data-aos="zoom-in"
                        data-aos-delay="500"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition"
                        data-aos="zoom-in"
                        data-aos-delay="600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {users.length > 0 && (
              <div className="w-full mt-12 mb-15 px-2 sm:px-0" data-aos="fade-up" data-aos-delay="300">
                <button
                  onClick={handleClearAll}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 font-semibold rounded-lg shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition"
                >
                  🧹 Clear All Credentials
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crud;
