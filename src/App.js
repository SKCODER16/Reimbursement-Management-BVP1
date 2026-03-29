import React, { useState, useEffect } from 'react';
import Employee from './components/Employee/Employee';
import Admin from './components/Admin/Admin';
import ManagerTable from './components/Manager/ManagerTable';

function App() {
  const [currentRole, setCurrentRole] = useState('employee');
  const [expenses, setExpenses] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [company, setCompany] = useState({ name: 'My Company', currency: 'INR', country: 'India' });
  const [users, setUsers] = useState([
    { id: 1, name: 'Sarah', email: 'sarah@company.com', role: 'Employee', manager: 'John', isManagerApprover: true },
    { id: 2, name: 'John', email: 'john@company.com', role: 'Manager', manager: '', isManagerApprover: false },
    { id: 3, name: 'Mitchell', email: 'mitchell@company.com', role: 'Manager', manager: '', isManagerApprover: false },
  ]);

  // Fetch exchange rates on load, cache in localStorage for 1 hour
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem('exchangeRates');
        const cachedTime = localStorage.getItem('exchangeRatesTime');
        const oneHour = 60 * 60 * 1000;

        if (cached && cachedTime && Date.now() - Number(cachedTime) < oneHour) {
          setExchangeRates(JSON.parse(cached));
          return;
        }

        const res = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
        const data = await res.json();
        setExchangeRates(data.rates);
        localStorage.setItem('exchangeRates', JSON.stringify(data.rates));
        localStorage.setItem('exchangeRatesTime', String(Date.now()));
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
        // Fallback rates if API fails
        setExchangeRates({ USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044, JPY: 1.78, INR: 1 });
      }
    };

    fetchRates();
  }, []);

  const handleSubmitExpense = (expense) => {
    const employee = users.find(u => u.name === expense.employee);
    const manager = users.find(u => u.name === employee?.manager);

    const approvalQueue = [];

    if (employee?.isManagerApprover && manager) {
      approvalQueue.push({
        approverId: manager.id,
        approverName: manager.name,
        step: 0,
        type: 'manager',
        status: 'pending',
        comment: ''
      });
    }

    approvalQueue.push({
      approverId: 99,
      approverName: 'Finance',
      step: approvalQueue.length,
      type: 'rule',
      status: 'pending',
      comment: ''
    });

    setExpenses(prev => [...prev, {
      ...expense,
      status: 'pending',
      currentStep: 0,
      approvalQueue
    }]);
  };

  const handleAction = (id, action, comment) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;

      const queue = [...exp.approvalQueue];
      queue[exp.currentStep] = {
        ...queue[exp.currentStep],
        status: action,
        comment
      };

      if (action === 'rejected') {
        return { ...exp, approvalQueue: queue, status: 'rejected' };
      }

      const nextStep = exp.currentStep + 1;
      if (nextStep < queue.length) {
        return { ...exp, approvalQueue: queue, currentStep: nextStep };
      }

      return { ...exp, approvalQueue: queue, status: 'approved' };
    }));
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
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
          <Employee
            expenses={expenses.filter(e => e.employee === 'Sarah')}
            onSubmitExpense={handleSubmitExpense}
            employeeName="Sarah"
          />
        )}

        {currentRole === 'manager' && (
          <ManagerTable
            expenses={expenses}
            currentManagerName="John"
            companyCurrency={company.currency}
            exchangeRates={exchangeRates}
            onApprove={(id, comment) => handleAction(id, 'approved', comment)}
            onReject={(id, comment) => handleAction(id, 'rejected', comment)}
          />
        )}

        {currentRole === 'admin' && (
          <Admin
            users={users}
            setUsers={setUsers}
          />
        )}
      </div>
    </div>
  );
}

export default App;