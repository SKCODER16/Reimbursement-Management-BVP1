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
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <nav style={{ background: '#1e293b', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
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
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                background: currentUser.role === role ? '#6366f1' : '#334155',
                color: 'white',
                margin: '0 5px',
                transition: '0.3s'
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
            cursor: 'pointer',
            marginLeft: '10px',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ padding: '20px' }}>
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