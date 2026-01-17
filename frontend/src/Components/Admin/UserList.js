import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Shield, Mail, Wallet } from 'lucide-react';

export const UserList = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (error) {
        console.error("Fetch users failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 font-medium hover:underline transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">User Directory</h2>
            <p className="text-gray-500 mt-1">Manage and view registered users</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 font-medium">Total Users:</span> <span className="text-blue-600 font-bold ml-1">{users.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading directory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                        </div>
                      </td>
                      <td className="p-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" /> {u.email}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role === 'admin' && <Shield size={12} />}
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <Wallet size={16} className="text-green-500" />
                          ₹{u.walletBalance}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
