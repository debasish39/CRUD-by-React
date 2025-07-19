import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Crud() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Store users in localStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('🧠 Users saved to localStorage:', users);
  }, [users]);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
    console.log('✨ AOS initialized');
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const updated = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updated);
    console.log(`✍️ Input Changed [${e.target.name}]:`, e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📨 Form Submitted:', formData);

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill out both fields");
      console.warn("⚠️ Empty fields submitted");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      console.warn("⚠️ Invalid email format");
      return;
    }

    if (editingIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = formData;
      setUsers(updatedUsers);
      console.log(`🛠️ Updated user at index ${editingIndex}:`, formData);
      setEditingIndex(null);
    } else {
      setUsers([...users, formData]);
      console.log('➕ New user added:', formData);
    }

    setFormData({ name: '', email: '' });
  };

  // Handle edit
  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditingIndex(index);
    console.log(`✏️ Editing user at index ${index}:`, users[index]);
  };

  // Handle delete
  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      console.log('❌ Delete canceled by user');
      return;
    }

    const deletedUser = users[index];
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    console.log(`🗑️ Deleted user at index ${index}:`, deletedUser);

    if (editingIndex === index) {
      setFormData({ name: '', email: '' });
      setEditingIndex(null);
      console.log('🔄 Reset form due to deleted user being edited');
    }
  };

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-200 p-6 sm:p-10">
      <div
        className="max-w-3xl mx-auto bg-transparent backdrop-blur-lg   p-8 transition-all duration-500"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-800 drop-shadow-md tracking-tight">
          {editingIndex !== null ? '✏️ Edit User' : '👤 Add User'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate data-aos="fade-up">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-300"
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-semibold rounded-xl shadow-md transition 
              active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
              ${editingIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <UserPlusIcon className="w-5 h-5" />
            {editingIndex !== null ? 'Update User' : 'Add User'}
          </button>
        </form>

        <hr className="my-10 border-gray-300" />

        <h3 className="text-2xl font-bold mb-6 text-gray-700" data-aos="fade-up">User List</h3>

        {users.length === 0 ? (
          <div className="text-center text-gray-400 py-10" data-aos="fade-up">
            <p className="text-lg">No users added yet.</p>
            <p className="text-sm">Start by filling out the form above.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-[#C1DBFF] border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg focus:shadow-lg active:shadow-lg ransition duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white px-3 py-1 rounded-md transition duration-300"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-3 py-1 rounded-md transition duration-300"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Crud;
