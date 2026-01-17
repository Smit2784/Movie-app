import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, MapPin, Monitor, Edit, Armchair } from 'lucide-react';

export const ManageTheaters = ({ onBack }) => {
  const [theaters, setTheaters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newTheater, setNewTheater] = useState({
    name: '',
    location: '',
    capacity: '',
    screens: 1,
    facilities: ''
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/theaters');
      const data = await res.json();
      if (data.theater) setTheaters(data.theater);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const handleEdit = (theater) => {
    setIsEditing(true);
    setEditId(theater._id);
    setNewTheater({
      name: theater.name,
      location: theater.location,
      capacity: theater.capacity,
      screens: theater.screens,
      facilities: Array.isArray(theater.facilities) ? theater.facilities.join(', ') : theater.facilities
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setNewTheater({ name: '', location: '', capacity: '', screens: 1, facilities: '' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const theaterData = {
      ...newTheater,
      facilities: newTheater.facilities.split(',').map(f => f.trim())
    };

    const url = isEditing
      ? `http://localhost:5000/api/admin/theaters/${editId}`
      : 'http://localhost:5000/api/admin/theaters';

    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(theaterData)
    });

    if (res.ok) {
      fetchTheaters();
      handleCancelEdit();
      alert(isEditing ? "Theater updated successfully!" : "Theater added successfully!");
    } else {
      alert("Operation failed. See console.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm("Remove this theater from the platform?")) {
      await fetch(`http://localhost:5000/api/admin/theaters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTheaters();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 font-medium hover:underline transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className={`p-3 rounded-xl ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isEditing ? <Edit size={24} /> : <Plus size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Theater' : 'Add New Theater'}</h2>
              <p className="text-sm text-gray-500">Configure theater details</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <input
              type="text" placeholder="Theater Name" className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              value={newTheater.name} onChange={(e) => setNewTheater({ ...newTheater, name: e.target.value })} required
            />

            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text" placeholder="Location" className="w-full p-3 pl-10 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={newTheater.location} onChange={(e) => setNewTheater({ ...newTheater, location: e.target.value })} required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number" placeholder="Capacity" className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={newTheater.capacity} onChange={(e) => setNewTheater({ ...newTheater, capacity: e.target.value })} required
              />
              <input
                type="number" placeholder="Screens" className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                value={newTheater.screens} onChange={(e) => setNewTheater({ ...newTheater, screens: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Facilities (WiFi, Parking, AC...)"
              className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition h-24 resize-none"
              value={newTheater.facilities} onChange={(e) => setNewTheater({ ...newTheater, facilities: e.target.value })}
            />

            <div className="flex gap-3 pt-4">
              {isEditing && (
                <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                  Cancel
                </button>
              )}
              <button type="submit" className={`flex-1 ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-200`}>
                {isEditing ? 'Update Theater' : 'Create Theater'}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Theater Network <span className="text-gray-400 text-lg ml-2">{theaters.length} locations</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theaters.length > 0 ? theaters.map(theater => (
              <div key={theater._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-md transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => handleEdit(theater)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(theater._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{theater.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {theater.location}</p>
                </div>

                <div className="flex items-center gap-4 py-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Capacity</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><Armchair size={14} /> {theater.capacity}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold">Screens</span>
                    <span className="text-gray-800 font-bold flex items-center gap-1"><Monitor size={14} /> {theater.screens}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {theater.facilities && theater.facilities.length > 0 ? theater.facilities.map((fac, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">{fac}</span>
                  )) : <span className="text-xs text-gray-300 italic">No facilities listed</span>}
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No theaters found. Add one to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 