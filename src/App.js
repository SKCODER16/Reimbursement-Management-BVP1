import React from 'react';
import Employee from './components/Employee/Employee';
import Admin from './components/Admin/Admin';
import ManagerTable from './components/Manager/ManagerTable';
import LoginPage from './components/Admin/LoginPage';
import { AppProvider, useApp } from './components/context/AppContext';

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
    <div>
      <nav className="glass-panel" style={{ padding: '12px 24px', display: 'flex', gap: '12px', alignItems: 'center', margin: '20px', position: 'sticky', top: 20, zIndex: 100 }}>
        <span style={{ marginRight: 'auto', paddingLeft: '20px', color: '#6366f1', fontWeight: 'bold' }}>
          🏢 {company?.companyName} ({company?.currencySymbol || company?.currency})
        </span>

        {/* Updated Role-Based Navigation */}
        {['employee', 'manager', 'CFO', 'admin'].map(role => {
          // Logic: 
          // 1. Admins can see everything to manage/demo the app.
          // 2. Other users only see the role they logged in as.
          if (currentUser.role !== 'admin' && role !== currentUser.role) {
            return null;
          }

          return (
            <button
              key={role}
              onClick={() => setCurrentUser({ ...currentUser, role })}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600',
                background: currentUser.role === role ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: currentUser.role === role ? '#fff' : 'var(--text-muted)',
                margin: '0 5px', transition: 'var(--transition)'
              }}
            >
              {role.toUpperCase()}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentUser(null)}
          style={{
            color: '#ef4444',
            background: 'transparent',
            border: '1px solid #ef4444',
            padding: '7px 15px',
            borderRadius: '8px',
            cursor: 'pointer', marginLeft: 'auto', fontWeight: '600', transition: 'var(--transition)'
          }}
        >
          Logout
        </button>
      </nav>

      <div className="animate-slide-up" style={{ padding: '0 20px' }}>
        {currentUser.role === 'employee' && (
          <Employee
            expenses={expenses}
            onSubmitExpense={submitExpense}
            employeeName={currentUser.name}
          />
        )}

        {(currentUser.role === 'manager' || currentUser.role === 'CFO') && (
          <ManagerTable
            // These props are kept for compatibility with your existing ManagerTable
            expenses={expenses.filter(e => e.status === 'pending')}
            companyCurrency={company?.currency}
            onApprove={(id, comment) => processApproval(id, 'approved', comment)}
            onReject={(id, comment) => processApproval(id, 'rejected', comment)}
          />
        )}

        {currentUser.role === 'admin' && <Admin />}
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