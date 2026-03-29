import React, { useState } from 'react';

const Admin = ({ onSetupComplete }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [company, setCompany] = useState({ name: 'My Company', currency: 'INR', country: 'India' });
  
  const [users, setUsers] = useState([
    { id: 1, name: 'Sarah', email: 'sarah@company.com', role: 'Employee', manager: 'John' },
    { id: 2, name: 'John', email: 'john@company.com', role: 'Manager', manager: '' },
    { id: 3, name: 'Mitchell', email: 'mitchell@company.com', role: 'Manager', manager: '' },
  ]);

  const [approvalRules, setApprovalRules] = useState([
    { id: 1, name: 'Default Rule', sequence: ['Manager', 'Finance', 'Director'], type: 'sequential', percentage: 100 }
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee', manager: '' });
  const [newRule, setNewRule] = useState({ name: '', type: 'sequential', percentage: 60, approvers: '' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);

  const countries = ['India', 'USA', 'UK', 'UAE', 'Germany', 'Japan', 'France'];
  const currencies = { India: 'INR', USA: 'USD', UK: 'GBP', UAE: 'AED', Germany: 'EUR', Japan: 'JPY', France: 'EUR' };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setCompany({ ...company, country, currency: currencies[country] || 'USD' });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setNewUser({ name: '', email: '', role: 'Employee', manager: '' });
    setShowAddUser(false);
  };

  const handleAddRule = () => {
    if (!newRule.name) return;
    setApprovalRules([...approvalRules, {
      ...newRule,
      id: Date.now(),
      sequence: newRule.approvers.split(',').map(a => a.trim())
    }]);
    setNewRule({ name: '', type: 'sequential', percentage: 60, approvers: '' });
    setShowAddRule(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleRoleChange = (id, role) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const sidebarItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: '👥 Users & Roles' },
    { id: 'approval', label: '✅ Approval Rules' },
    { id: 'company', label: '🏢 Company Settings' },
  ];

  return (
    <div style={{ display: 'flex', fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#1e293b', padding: '20px', flexShrink: 0 }}>
        <h2 style={{ color: '#6366f1', marginTop: 0, fontSize: '18px' }}>⚙️ Admin Panel</h2>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          {company.name} · {company.currency}
        </div>
        {sidebarItems.map(item => (
          <div key={item.id} onClick={() => setCurrentView(item.id)}
            style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
              background: currentView === item.id ? '#6366f1' : 'transparent',
              color: currentView === item.id ? 'white' : '#94a3b8' }}>
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>

        {/* DASHBOARD */}
        {currentView === 'dashboard' && (
          <div>
            <h1 style={{ color: '#e2e8f0', marginTop: 0 }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              {[
                { label: 'Total Employees', value: users.filter(u => u.role === 'Employee').length, color: '#6366f1' },
                { label: 'Total Managers', value: users.filter(u => u.role === 'Manager').length, color: '#22c55e' },
                { label: 'Approval Rules', value: approvalRules.length, color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', borderTop: `3px solid ${stat.color}` }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                  <div style={{ color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>All Users</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    {['Name', 'Email', 'Role', 'Manager'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '10px 8px', color: '#e2e8f0' }}>{u.name}</td>
                      <td style={{ padding: '10px 8px', color: '#94a3b8' }}>{u.email}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: u.role === 'Manager' ? '#22c55e22' : '#6366f122', color: u.role === 'Manager' ? '#22c55e' : '#6366f1', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', color: '#94a3b8' }}>{u.manager || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {currentView === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ color: '#e2e8f0', margin: 0 }}>Users & Roles</h1>
              <button onClick={() => setShowAddUser(!showAddUser)}
                style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Add User
              </button>
            </div>

            {showAddUser && (
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>New User</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <select value={newUser.manager} onChange={e => setNewUser({ ...newUser, manager: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
                    <option value="">Select Manager</option>
                    {users.filter(u => u.role === 'Manager').map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleAddUser}
                  style={{ marginTop: '12px', padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save User
                </button>
              </div>
            )}

            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    {['Name', 'Email', 'Role', 'Manager', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '10px 8px', color: '#e2e8f0' }}>{u.name}</td>
                      <td style={{ padding: '10px 8px', color: '#94a3b8' }}>{u.email}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white', fontSize: '12px' }}>
                          <option value="Employee">Employee</option>
                          <option value="Manager">Manager</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 8px', color: '#94a3b8' }}>{u.manager || '—'}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <button onClick={() => handleDeleteUser(u.id)}
                          style={{ padding: '4px 10px', background: '#ef444422', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPROVAL RULES */}
        {currentView === 'approval' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ color: '#e2e8f0', margin: 0 }}>Approval Rules</h1>
              <button onClick={() => setShowAddRule(!showAddRule)}
                style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                + Add Rule
              </button>
            </div>

            {showAddRule && (
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>New Approval Rule</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Rule Name" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  <select value={newRule.type} onChange={e => setNewRule({ ...newRule, type: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
                    <option value="sequential">Sequential</option>
                    <option value="percentage">Percentage</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <input placeholder="Approvers (comma separated: Manager, Finance, Director)" value={newRule.approvers}
                    onChange={e => setNewRule({ ...newRule, approvers: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', gridColumn: '1 / -1' }} />
                  {(newRule.type === 'percentage' || newRule.type === 'hybrid') && (
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '13px' }}>Min Approval %: {newRule.percentage}%</label>
                      <input type="range" min="10" max="100" value={newRule.percentage}
                        onChange={e => setNewRule({ ...newRule, percentage: e.target.value })}
                        style={{ width: '100%', marginTop: '8px' }} />
                    </div>
                  )}
                </div>
                <button onClick={handleAddRule}
                  style={{ marginTop: '12px', padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Save Rule
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {approvalRules.map(rule => (
                <div key={rule.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#e2e8f0' }}>{rule.name}</h3>
                    <span style={{ background: '#6366f122', color: '#6366f1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{rule.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {rule.sequence.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: '#0f172a', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#e2e8f0', border: '1px solid #334155' }}>
                          Step {i + 1}: {step}
                        </span>
                        {i < rule.sequence.length - 1 && <span style={{ color: '#6366f1' }}>→</span>}
                      </div>
                    ))}
                  </div>
                  {rule.percentage && rule.type !== 'sequential' && (
                    <div style={{ marginTop: '8px', color: '#94a3b8', fontSize: '13px' }}>Min approval: {rule.percentage}%</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPANY SETTINGS */}
        {currentView === 'company' && (
          <div>
            <h1 style={{ color: '#e2e8f0', marginTop: 0 }}>Company Settings</h1>
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '28px', maxWidth: '500px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Company Name</label>
                <input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Country</label>
                <select value={company.country} onChange={handleCountryChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>Base Currency (auto-set)</label>
                <input value={company.currency} readOnly
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#6366f1', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => alert('Settings saved!')}
                style={{ width: '100%', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                Save Settings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;