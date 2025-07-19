import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';

function Crud() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    console.log(users);
    console.log(JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      if (!formData.name.trim() || !formData.email.trim()) {
    alert("Please fill out both fields");
    return;
  }

// Email format check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  alert("Please enter a valid email address");
  return;
}
    if (editingIndex !== null) {
      const updatedUsers = [...users];
      console.log(updatedUsers);
      updatedUsers[editingIndex] = formData;
      console.log(editingIndex);
      console.log(formData);
      console.log(updatedUsers[editingIndex]);
      setUsers(updatedUsers);
      console.log(updatedUsers);
      setEditingIndex(null);
    } else {
      setUsers([...users, formData]);
    }

    setFormData({ name: '', email: '' });
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    console.log(index);
    console.log(users[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    // console.log(_);

    if (editingIndex === index) {
      setFormData({ name: '', email: '' });
      setEditingIndex(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">
        {editingIndex !== null ? '✏️ Edit User' : '👤 Add User'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-md shadow-sm" noValidate>
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-1">Name</label>
          <input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">Email</label>
          <input 
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className={` cursor-pointer w-full flex items-center justify-center gap-2 py-2 px-4 text-white font-medium rounded-md transition 
            ${editingIndex !== null ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <UserPlusIcon className="w-5 h-5" />
          {editingIndex !== null ? 'Update User' : 'Add User'}
        </button>
      </form>

      <hr className="my-8 border-gray-300" />

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">User List</h3>

      {users.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p className="text-lg">No users added yet.</p>
          <p className="text-sm">Start by filling out the form above.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {users.map((user, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white border border-gray-200 shadow-sm p-4 rounded-md"
            >
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="cursor-pointer flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className=" cursor-pointer flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Crud;
