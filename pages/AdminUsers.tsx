
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLayout } from '../layouts/AdminLayout';
import { User } from '../types';
import { Plus, Trash2, Search, Mail, Phone, MapPin, Calendar, X, Save } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, adminDeleteUser, adminAddUser, adminStoreId, stores } = useApp();
  const activeStore = stores.find(s => s.id === adminStoreId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer',
    password: 'password123'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      adminDeleteUser(id);
    }
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    adminAddUser({
        ...newUser,
        id: `u${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0]
    } as User);
    
    setIsModalOpen(false);
    setNewUser({ name: '', email: '', phone: '', address: '', role: 'customer', password: 'password123' });
  };

  return (
    <AdminLayout title="User Management">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className={`flex items-center gap-2 px-4 py-2 bg-${activeStore?.themeColor}-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap`}
           >
             <Plus size={18} /> Add User
           </button>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="px-6 py-4 font-semibold text-gray-600 text-sm">User</th>
                 <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Contact</th>
                 <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Joined</th>
                 <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Role</th>
                 <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {filteredUsers.map(user => (
                 <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                         {user.name.charAt(0)}
                       </div>
                       <div>
                         <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                         <p className="text-xs text-gray-500">ID: {user.id}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                           <Mail size={14} className="text-gray-400" /> {user.email}
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone size={14} className="text-gray-400" /> {user.phone}
                            </div>
                        )}
                        {user.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={14} className="text-gray-400" /> <span className="truncate max-w-[150px]">{user.address}</span>
                            </div>
                        )}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <Calendar size={14} className="text-gray-400" /> {user.joinedDate}
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                         {user.role}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <button 
                       onClick={() => handleDelete(user.id)}
                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       title="Delete User"
                     >
                       <Trash2 size={16} />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
           {filteredUsers.length === 0 && (
             <div className="p-10 text-center text-gray-400">
               No users found matching your search.
             </div>
           )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-scale-in">
             <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-900">Add New User</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                        value={newUser.phone}
                        onChange={e => setNewUser({...newUser, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black bg-white"
                        value={newUser.role}
                        onChange={e => setNewUser({...newUser, role: e.target.value as 'admin' | 'customer'})}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    value={newUser.address}
                    onChange={e => setNewUser({...newUser, address: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                  <input 
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                    value={newUser.password}
                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                  />
               </div>
             </div>

             <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Cancel</button>
               <button 
                 onClick={handleAddUser}
                 className={`px-4 py-2 bg-${activeStore?.themeColor}-500 text-white font-bold rounded-lg hover:opacity-90 flex items-center gap-2`}
               >
                 <Save size={16} /> Save User
               </button>
             </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
