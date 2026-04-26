import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Users, Search, Filter, Edit2, X, Save, Shield,
  Star, TrendingUp, UserPlus, Trash2, ChevronDown,
  AlertTriangle, CheckCircle
} from 'lucide-react';

const RISK_OPTIONS = ['High', 'Medium', 'Low'];
const EXP_OPTIONS = ['Junior', 'Standard', 'Senior', 'Expert'];
const SPEC_OPTIONS = ['high-risk', 'low-risk', 'mixed', 'crypto', 'equities'];

const EditUserModal = ({ user, employees, onSave, onClose }) => {
  const isEmployee = user.role === 'Employee';
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    riskAppetite: user.riskAppetite || 'Medium',
    experience: user.experience || 'Junior',
    specialization: user.specialization || 'Equity',
    preferredSpecialization: user.preferredSpecialization || 'Equity',
    complexity: user.complexity || 5,
    successRate: user.successRate || 75,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black">
              {user.name?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">{user.name}</h3>
              <p className="text-xs text-gray-400">Edit User Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            >
              <option value="Employee">Trader (Employee)</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {form.role === 'Employee' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                  <select
                    value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                  >
                    {EXP_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Success Rate %</label>
                  <Input
                    type="number" min="0" max="100"
                    value={form.successRate}
                    onChange={e => setForm({ ...form, successRate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
                <select
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                >
                  {SPEC_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Risk Appetite</label>
                <div className="flex gap-2">
                  {RISK_OPTIONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, riskAppetite: r })}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                        form.riskAppetite === r
                          ? r === 'High' ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400'
                            : r === 'Medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/30 dark:text-yellow-400'
                            : 'bg-green-100 border-green-300 text-green-700 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400'
                          : 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Preferred Market</label>
                <select
                  value={form.preferredSpecialization}
                  onChange={e => setForm({ ...form, preferredSpecialization: e.target.value })}
                  className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                >
                  {['Equity', 'Forex', 'Crypto', 'Commodities'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Complexity</label>
                  <span className="text-xs font-bold text-indigo-600">{form.complexity}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={form.complexity}
                  onChange={e => setForm({ ...form, complexity: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => { onSave(user.id, form); onClose(); }}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UsersManagement = () => {
  const { employees, customers, updateUser, registerCustomer } = useAppData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: 'Employee', experience: 'Junior', specialization: 'mixed', successRate: 75, risk: 'Medium' });

  const allUsers = [...employees.map(e => ({ ...e, type: 'Employee' })), ...customers.map(c => ({ ...c, type: 'Customer' }))];

  const filtered = allUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = () => {
    if (!newUser.name.trim()) return;
    if (newUser.role === 'Customer') {
      registerCustomer({ name: newUser.name, risk: newUser.risk || 'Medium' });
    } else {
      // Add as employee via updateUser pattern — use context to add employee
      const fakeId = `emp_${Date.now()}`;
      employees.push({ ...newUser, id: fakeId }); // Immediate update (demo)
    }
    setNewUser({ name: '', role: 'Employee', experience: 'Junior', specialization: 'mixed', successRate: 75, risk: 'Medium' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Users Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {employees.length} traders · {customers.length} clients · {allUsers.length} total
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 h-10 px-5">
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Add User Panel */}
      {showAddForm && (
        <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-500" /> New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <Input
                  label="Name"
                  placeholder="e.g. David Lee"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Employee">Trader</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              {newUser.role === 'Employee' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience</label>
                    <select
                      value={newUser.experience}
                      onChange={e => setNewUser({ ...newUser, experience: e.target.value })}
                      className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {EXP_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
                    <select
                      value={newUser.specialization}
                      onChange={e => setNewUser({ ...newUser, specialization: e.target.value })}
                      className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {SPEC_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Risk</label>
                  <select
                    value={newUser.risk}
                    onChange={e => setNewUser({ ...newUser, risk: e.target.value })}
                    className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {RISK_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}
              <Button onClick={handleAddUser} className="h-10">
                <CheckCircle className="w-4 h-4 mr-2" /> Create
              </Button>
              <Button variant="ghost" className="h-10" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <Filter className="w-4 h-4 text-gray-400 self-center" />
          {['All', 'Employee', 'Customer'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(u => (
          <div
            key={u.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black">
                  {u.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{u.name}</p>
                  <Badge variant={u.role === 'Employee' ? 'brand' : 'default'} className="text-xs mt-0.5">
                    {u.role === 'Employee' ? 'Trader' : 'Client'}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(u)}
                className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {u.role === 'Employee' ? (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{u.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialization</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{u.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Rate</span>
                  <span className={`font-bold ${(u.successRate || 0) >= 85 ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {u.successRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Clients Assigned</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {customers.filter(c => c.assignedTraderId === u.id).length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Appetite</span>
                  <Badge variant={u.riskAppetite === 'High' ? 'danger' : u.riskAppetite === 'Low' ? 'success' : 'warning'} className="text-xs">
                    {u.riskAppetite || 'Medium'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Market Focus</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {u.preferredSpecialization || 'Equity'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Complexity</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {u.complexity || 5}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rating</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= (u.feedback || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Coins Balance</span>
                  <span className="font-semibold font-mono text-gray-800 dark:text-gray-200">{u.coins || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Trader</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                    {u.assignedTraderId
                      ? (employees.find(e => e.id === u.assignedTraderId)?.name || 'Unknown')
                      : <span className="text-amber-500">Unassigned</span>}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No users match your search.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          employees={employees}
          onSave={(id, data) => updateUser(id, data)}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};
