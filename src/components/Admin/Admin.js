import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Admin = ({ onSetupComplete }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  const { company, setCompany, users, setUsers, approvalRulesArray: approvalRules, setApprovalRulesArray: setApprovalRules } = useApp();


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
    <div style={{ display: 'flex', gap: '24px' }}>
      
      {/* Sidebar */}
      <div className="glass-panel" style={{ width: '240px', padding: '24px', flexShrink: 0, height: 'fit-content', position: 'sticky', top: 100 }}>
        <h2 style={{ color: '#6366f1', marginTop: 0, fontSize: '18px' }}>⚙️ Admin Panel</h2>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          {company.name} · {company.currency}
        </div>
        {sidebarItems.map(item => (
          <div key={item.id} onClick={() => setCurrentView(item.id)}
            style={{ padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', marginBottom: '8px',
              fontWeight: 600, transition: 'var(--transition)',
              background: currentView === item.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
              color: currentView === item.id ? 'white' : 'var(--text-muted)' }}>
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
                { label: 'Total Employees', value: Array.isArray(users) ? users.filter(u => u.role === 'Employee').length : 0, color: '#6366f1' },
                { label: 'Total Managers', value: Array.isArray(users) ? users.filter(u => u.role === 'Manager').length : 0, color: '#10b981' },
                { label: 'Approval Rules', value: Array.isArray(approvalRules) ? approvalRules.length : 0, color: '#f59e0b' },
              ].map((stat, i) => (
                <div key={i} className="glass-panel animate-slide-up" style={{ padding: '24px', borderTop: `4px solid ${stat.color}`, animationDelay: `${i * 0.1}s` }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="glass-panel animate-slide-up" style={{ padding: '24px', animationDelay: '0.3s' }}>
              <h3 style={{ color: '#e2e8f0', marginTop: 0, marginBottom: '20px' }}>All Users Index</h3>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ color: '#e2e8f0', margin: 0 }}>Users & Roles</h1>
              <button className="btn-primary" onClick={() => setShowAddUser(!showAddUser)}>
                + Add User
              </button>
            </div>

            {showAddUser && (
              <div className="glass-panel animate-slide-up" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary)' }}>
                <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>New User</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input className="glass-input" placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                  <input className="glass-input" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  <select className="glass-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option style={{color:'#000'}} value="Employee">Employee</option>
                    <option style={{color:'#000'}} value="Manager">Manager</option>
                    <option style={{color:'#000'}} value="CFO">CFO</option>
                  </select>
                  <select className="glass-input" value={newUser.manager} onChange={e => setNewUser({ ...newUser, manager: e.target.value })}>
                    <option style={{color:'#000'}} value="">Select Manager</option>
                    {Array.isArray(users) && users.filter(u => u.role === 'Manager').map(m => (
                      <option style={{color:'#000'}} key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-success" onClick={handleAddUser} style={{ marginTop: '20px', padding: '10px 24px', fontSize: 15 }}>
                  Save User
                </button>
              </div>
            )}

            <div className="glass-panel animate-slide-up" style={{ padding: '24px' }}>
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
                          <option value="CFO">CFO</option>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ color: '#e2e8f0', margin: 0 }}>Approval Rules</h1>
              <button className="btn-primary" onClick={() => setShowAddRule(!showAddRule)}>
                + Add Rule
              </button>
            </div>

            {showAddRule && (
              <div className="glass-panel animate-slide-up" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary)' }}>
                <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>New Approval Rule</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input className="glass-input" placeholder="Rule Name" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} />
                  <select className="glass-input" value={newRule.type} onChange={e => setNewRule({ ...newRule, type: e.target.value })}>
                    <option style={{color:'#000'}} value="sequential">Sequential</option>
                    <option style={{color:'#000'}} value="percentage">Percentage</option>
                    <option style={{color:'#000'}} value="hybrid">Hybrid</option>
                  </select>
                  <input className="glass-input" placeholder="Approvers (comma separated: Manager, Finance, Director)" value={newRule.approvers}
                    onChange={e => setNewRule({ ...newRule, approvers: e.target.value })}
                    style={{ gridColumn: '1 / -1' }} />
                  {(newRule.type === 'percentage' || newRule.type === 'hybrid') && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Min Approval Threshold: <span style={{color: 'var(--primary)'}}>{newRule.percentage}%</span></label>
                      <input type="range" min="10" max="100" value={newRule.percentage}
                        onChange={e => setNewRule({ ...newRule, percentage: e.target.value })}
                        style={{ width: '100%', marginTop: '12px', accentColor: 'var(--primary)' }} />
                    </div>
                  )}
                </div>
                <button className="btn-success" onClick={handleAddRule} style={{ marginTop: '20px', padding: '10px 24px', fontSize: 15 }}>
                  Save Rule
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(Array.isArray(approvalRules) ? approvalRules : []).map((rule, idx) => (
                <div key={rule.id} className="glass-panel animate-slide-up" style={{ padding: '24px', animationDelay: `${idx * 0.1}s` }}>
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
          <div className="animate-slide-up">
            <h1 style={{ color: '#e2e8f0', marginTop: 0 }}>Company Settings</h1>
            <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Company Name</label>
                <input className="glass-input" style={{ width: '100%' }} value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Country</label>
                <select className="glass-input" style={{ width: '100%' }} value={company.country} onChange={handleCountryChange}>
                  {countries.map(c => <option style={{color:'#000'}} key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Base Currency (auto-set)</label>
                <input className="glass-input" readOnly style={{ width: '100%', color: 'var(--primary)', borderColor: 'var(--primary)', background: 'rgba(99,102,241,0.05)' }} value={company.currency} />
              </div>
              <button className="btn-primary" onClick={() => alert('Settings saved!')} style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
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