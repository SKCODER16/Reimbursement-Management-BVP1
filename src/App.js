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

  // If no user is logged in, show the teammate's new Login Page
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
      <nav style={{ background: '#1e293b', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <span style={{ marginRight: 'auto', paddingLeft: '20px', color: '#6366f1' }}>
          🏢 {company?.companyName} ({company?.currencySymbol})
        </span>
        {/* Role Switcher for Demo Purposes */}
        {['employee', 'manager', 'admin'].map(role => (
          <button key={role} onClick={() => setCurrentUser({ ...currentUser, role })}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              background: currentUser.role === role ? '#6366f1' : '#334155', color: 'white', margin: '0 5px'
            }}>
            {role.toUpperCase()}
          </button>
        ))}
        <button onClick={() => setCurrentUser(null)} style={{ color: '#ef4444', marginLeft: '10px' }}>Logout</button>
      </nav>

      <div style={{ padding: '20px' }}>
        {currentUser.role === 'employee' && (
          <Employee
            expenses={expenses}
            onSubmitExpense={submitExpense}
            employeeName={currentUser.name}
          />
        )}

        {currentUser.role === 'manager' && (
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
  );
}

// Wrap the entire App in the Provider
export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}