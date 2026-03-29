import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Avatar Placeholder
const Avatar = ({ initials, color }) => (
  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: color || 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
    {initials}
  </div>
);

const Admin = ({ onSetupComplete }) => {
  const [currentView, setCurrentView] = useState('users');

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
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'approval', label: 'Rules', icon: '≡' },
    { id: 'company', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Dynamic Left Sidebar for Admin */}
      <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2 style={{ color: 'var(--primary)', margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Admin Portal</h2>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          System Oversight
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sidebarItems.map(item => (
            <div key={item.id} onClick={() => setCurrentView(item.id)}
              style={{
                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '12px',
                background: currentView === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: currentView === item.id ? 'var(--text-main)' : 'var(--text-muted)'
              }}>
              <span style={{ fontSize: '16px', opacity: currentView === item.id ? 1 : 0.7 }}>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => { setCurrentView('approval'); setShowAddRule(true); }} style={{ marginTop: '32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
          <span>+</span> New Rule
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>❓</span> Support
          </div>
          <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>💬</span> Feedback
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>

        {/* USERS (Default Dashboard replacement for mockup logic) */}
        {currentView === 'users' && (
          <div className="animate-slide-up">

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <div className="surface-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Employees</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px', lineHeight: 1 }}>{Array.isArray(users) ? users.length : 0}</div>
                <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>↗</span> 12% from last quarter
                </div>
                <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '120px', opacity: 0.03 }}>👥</div>
              </div>

              <div className="surface-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Managers</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--success)', marginBottom: '16px', lineHeight: 1 }}>{Array.isArray(users) ? users.filter(u => u.role === 'Manager' || u.role === 'CFO').length : 0}</div>
                <div style={{ fontSize: '13px', color: 'var(--warning)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'currentColor' }}>∷</span> Direct reports optimized
                </div>
                <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '120px', opacity: 0.03 }}>💼</div>
              </div>

              <div className="surface-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Rules</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--warning)', marginBottom: '16px', lineHeight: 1 }}>{Array.isArray(approvalRules) ? approvalRules.length : 0}</div>
                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span> All policies compliant
                </div>
                <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', fontSize: '120px', opacity: 0.03 }}>≡</div>
              </div>
            </div>

            <div className="surface-panel">
              <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-starlight)' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>All Users Index</h2>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Directory of all personnel within the Reimburse IQ ecosystem.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ background: 'transparent', border: '1px solid var(--border-starlight)', color: 'var(--text-main)', padding: '10px 20px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}>
                    Export CSV
                  </button>
                  <button className="btn-primary" onClick={() => setShowAddUser(!showAddUser)} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👤</span> Add User
                  </button>
                </div>
              </div>

              {showAddUser && (
                <div style={{ padding: '24px 32px', background: 'rgba(99, 102, 241, 0.05)', borderBottom: '1px solid var(--border-starlight)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input className="glass-input" placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                    <input className="glass-input" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    <select className="glass-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option style={{ color: '#000' }} value="Employee">Employee</option>
                      <option style={{ color: '#000' }} value="Manager">Manager</option>
                      <option style={{ color: '#000' }} value="CFO">CFO</option>
                    </select>
                    <select className="glass-input" value={newUser.manager} onChange={e => setNewUser({ ...newUser, manager: e.target.value })}>
                      <option style={{ color: '#000' }} value="">Select Manager</option>
                      {Array.isArray(users) && users.filter(u => u.role === 'Manager' || u.role === 'CFO').map(m => (
                        <option style={{ color: '#000' }} key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn-success" onClick={handleAddUser} style={{ marginTop: '16px' }}>
                    Save User
                  </button>
                </div>
              )}

              <table className="vivid-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '20px 32px' }}>User Identity</th>
                    <th>Official Role</th>
                    <th>Direct Manager</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td style={{ padding: '20px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Avatar initials={u.name.substring(0, 2).toUpperCase()} color={i % 2 === 0 ? '#4f46e5' : '#059669'} />
                          <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px', marginBottom: '4px' }}>{u.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-main)' }}>{u.manager || '—'}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '13px', fontWeight: 500 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div> Active
                        </span>
                      </td>
                      <td>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-starlight)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Showing {users.length} of {users.length} employees</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>&lt;</button>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>1</div>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>&gt;</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPATIBILITY VIEWS for Settings/Rules */}
        {currentView === 'dashboard' && (
          <div className="animate-slide-up">
            <h1 style={{ color: '#e2e8f0', marginTop: 0 }}>Legacy Dashboard Data</h1>
            <p style={{ color: 'var(--text-muted)' }}>Use the Users tab for the new Reimburse IQ overview.</p>
          </div>
        )}

        {currentView === 'approval' && (
          <div className="animate-slide-up">
            <div className="surface-panel" style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddRule ? '0' : '24px', borderRadius: showAddRule ? '16px 16px 0 0' : '16px', borderBottom: showAddRule ? '1px solid var(--border-starlight)' : 'none' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>Approval Rules System</h2>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Define step-by-step hierarchies or parallel required approvals.</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddRule(!showAddRule)} style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{showAddRule ? '✕' : '+'}</span> {showAddRule ? 'Cancel' : 'New Rule'}
              </button>
            </div>

            {showAddRule && (
              <div className="surface-panel animate-slide-up" style={{ padding: '32px', marginBottom: '24px', borderRadius: '0 0 16px 16px', background: 'rgba(99, 102, 241, 0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>Rule Name</label>
                    <input className="glass-input" style={{ width: '100%' }} placeholder="e.g. Executive Travel" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>Approval Type</label>
                    <select className="glass-input" style={{ width: '100%' }} value={newRule.type} onChange={e => setNewRule({ ...newRule, type: e.target.value })}>
                      <option style={{ color: '#000' }} value="sequential">Sequential (Step 1 → Step 2)</option>
                      <option style={{ color: '#000' }} value="horizontal">Horizontal (Any % of group)</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>Required Approvers (comma-separated roles or exact emails)</label>
                    <input className="glass-input" style={{ width: '100%' }} placeholder="e.g. Manager, CFO" value={newRule.approvers} onChange={e => setNewRule({ ...newRule, approvers: e.target.value })} />
                  </div>
                  {newRule.type === 'horizontal' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px' }}>Minimum Approval Percentage (%)</label>
                      <input type="number" className="glass-input" style={{ width: '100%' }} value={newRule.percentage} onChange={e => setNewRule({ ...newRule, percentage: Number(e.target.value) })} />
                    </div>
                  )}
                </div>
                <button className="btn-success" onClick={handleAddRule} style={{ marginTop: '24px', padding: '12px 24px' }}>
                  Save Approval Rule
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(!approvalRules || approvalRules.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--surface-midnight)', borderRadius: '16px', border: '1px solid var(--border-starlight)' }}>
                  No rules assigned. Default system thresholds will apply.
                </div>
              )}
              {(Array.isArray(approvalRules) ? approvalRules : []).map((rule, idx) => (
                <div key={rule.id} className="surface-panel animate-slide-up" style={{ padding: '24px', animationDelay: `${idx * 0.1}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {idx + 1}
                      </div>
                      <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '18px' }}>{rule.name}</h3>
                    </div>
                    <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {rule.type} {rule.type === 'horizontal' && `(${rule.percentage}%)`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap', alignItems: 'center', paddingLeft: '42px' }}>
                    {rule.sequence && rule.sequence.map((step, i) => (
                      <React.Fragment key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ background: 'var(--bg-deep-space)', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontSize: '13px', color: '#e2e8f0', border: '1px solid var(--border-starlight)', fontWeight: 600 }}>
                            {rule.type === 'sequential' && <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Step {i + 1}:</span>}
                            {step}
                          </span>
                        </div>
                        {i < rule.sequence.length - 1 && (
                          <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', margin: '0 4px', fontSize: '16px' }}>
                            {rule.type === 'sequential' ? '→' : '+'}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'company' && (
          <div className="animate-slide-up">
            <h1 style={{ color: '#e2e8f0', marginTop: 0 }}>Company Settings</h1>
            <div className="surface-panel" style={{ padding: '32px', maxWidth: '500px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Company Name</label>
                <input className="glass-input" style={{ width: '100%' }} value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Country</label>
                <select className="glass-input" style={{ width: '100%' }} value={company.country} onChange={handleCountryChange}>
                  {countries.map(c => <option style={{ color: '#000' }} key={c} value={c}>{c}</option>)}
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