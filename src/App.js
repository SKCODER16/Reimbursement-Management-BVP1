import React, { useState } from 'react';
import Employee from './components/Employee/Employee';
import Admin from './components/Admin/Admin';
import ManagerTable from './components/Manager/ManagerTable';

function App() {
  const [currentRole, setCurrentRole] = useState('employee');
  const [expenses, setExpenses] = useState([]);

  // These states are the "Source of Truth" from Person A's Admin logic
  const [company, setCompany] = useState({ name: 'My Company', currency: 'INR', country: 'India' });
  const [users] = useState([
    { id: 1, name: 'Sarah', email: 'sarah@company.com', role: 'Employee', manager: 'John' },
    { id: 2, name: 'John', email: 'john@company.com', role: 'Manager', manager: '' },
    { id: 3, name: 'Mitchell', email: 'mitchell@company.com', role: 'Manager', manager: '' },
  ]);

  const handleSubmitExpense = (expense) => {
    // Add new expense to the main list with a 'pending' status
    setExpenses([...expenses, { ...expense, status: 'pending' }]);
  };

  const handleAction = (id, newStatus, comment) => {
    setExpenses(prev => prev.map(exp =>
      exp.id === id ? { ...exp, status: newStatus, managerComment: comment } : exp
    ));
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      {/* Universal Role Switcher for the Hackathon Demo */}
      <nav style={{ background: '#1e293b', padding: '10px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {['employee', 'manager', 'admin'].map(role => (
          <button key={role} onClick={() => setCurrentRole(role)}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
              background: currentRole === role ? '#6366f1' : '#334155', color: 'white'
            }}>
            {role.toUpperCase()}
          </button>
        ))}
      </nav>

      <div style={{ padding: '20px' }}>
        {currentRole === 'employee' && (
          <Employee expenses={expenses} onSubmitExpense={handleSubmitExpense} employeeName="Sarah" />
        )}

        {currentRole === 'manager' && (
          <ManagerTable
            expenses={expenses.filter(e => e.status === 'pending')}
            companyCurrency={company.currency}
            onApprove={(id, comment) => handleAction(id, 'approved', comment)}
            onReject={(id, comment) => handleAction(id, 'rejected', comment)}
          />
        )}

        {currentRole === 'admin' && (
          <Admin />
        )}
      </div>
    </div>
  );
}

export default App;