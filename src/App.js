import React from 'react';
import Employee from './components/Employee/Employee';
import Admin from './components/Admin/Admin';
import ManagerTable from './components/Manager/ManagerTable';
import LoginPage from './components/Admin/LoginPage';
import { AppProvider, useApp } from './components/context/AppContext';

// Simple Avatar SVG Placeholder
const AvatarSVG = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#1e293b" />
    <circle cx="16" cy="11" r="5" fill="#f8fafc" />
    <path d="M7 26C7 21.0294 11.0294 17 16 17C20.9706 17 25 21.0294 25 26" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function AppInner() {
  const {
    currentUser, setCurrentUser,
    company, setCompany,
    expenses, submitExpense, processApproval
  } = useApp();

  if (!currentUser) {
    return (
      <LoginPage
        onNavigate={(target, user, comp) => {
          setCurrentUser(user);
          setCompany(comp);
        }}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Top Header Navigation */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '72px', borderBottom: '1px solid var(--border-starlight)', background: 'var(--bg-deep-space)', flexShrink: 0 }}>

        {/* Logo / Brand */}
        <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
          {company?.companyName || "Reimburse IQ"}
        </div>

        {/* Center Tabs */}
        <div style={{ display: 'flex', gap: '32px', height: '100%', alignItems: 'center' }}>
          {['employee', 'manager', 'CFO', 'admin'].map(role => {
            if (currentUser.role !== 'admin' && role !== currentUser.role) return null;
            const isActive = currentUser.role === role;
            return (
              <button
                key={role}
                onClick={() => setCurrentUser({ ...currentUser, role })}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '15px', fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  padding: '24px 0', transition: 'all 0.2s',
                  textTransform: 'capitalize', display: 'flex', alignItems: 'center'
                }}
              >
                {role}
              </button>
            )
          })}
        </div>

        {/* Right Tools & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="glass-input" style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--surface-midnight)', border: 'none' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>🔍</span>
            <input placeholder="Search system..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '14px', width: '160px', fontFamily: 'Plus Jakarta Sans' }} />
          </div>

          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px', display: 'flex' }} onClick={() => setCurrentUser(null)} title="Sign Out">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ cursor: 'pointer', display: 'flex' }}>
            <AvatarSVG />
          </div>
        </div>
      </header>

      {/* Main App Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {currentUser.role === 'employee' && (
            <Employee
              expenses={expenses}
              onSubmitExpense={submitExpense}
              employeeName={currentUser.name}
            />
          )}

          {(currentUser.role === 'manager' || currentUser.role === 'CFO') && (
            <ManagerTable
              expenses={expenses.filter(e => e.status === 'pending')}
              companyCurrency={company?.currency}
              onApprove={(id, comment) => processApproval(id, 'approved', comment)}
              onReject={(id, comment) => processApproval(id, 'rejected', comment)}
            />
          )}

          {currentUser.role === 'admin' && <Admin />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}