import React, { useState } from 'react';
import ManagerTable from './components/Manager/ManagerTable';
import Employee from './components/Employee/Employee.js';

function App() {
  // Mock data representing what Person B (Employee) will eventually send you
  const [dummyExpenses, setDummyExpenses] = useState([
    {
      id: 1,
      employeeName: 'Sarah',
      category: 'Food',
      status: 'Pending',
      amount: 50,
      currency: 'USD',
      convertedAmount: 4200 // This will eventually be calculated by your service
    },
    {
      id: 2,
      employeeName: 'John',
      category: 'Travel',
      status: 'Pending',
      amount: 100,
      currency: 'EUR',
      convertedAmount: 8900
    }
  ]);

  const handleApprove = (id) => {
    setDummyExpenses(prev => prev.map(exp => {
      if (exp.id === id) {
        // This updates the specific expense status instead of deleting it
        return { ...exp, status: 'Approved by Manager' };
      }
      return exp;
    }));
  };

  const handleReject = (id) => {
    setDummyExpenses(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, status: 'Rejected' };
      }
      return exp;
    }));
  };

  const [expenses, setExpenses] = useState([]);

  const handleSubmitExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <h1>Reimbursement Management</h1>
      
      {/* Employee Section */}
      <Employee
        expenses={expenses}
        onSubmitExpense={handleSubmitExpense}
        employeeName="Sarah"
      />

      <hr style={{ margin: '2rem 0', borderColor: '#333' }} />

      {/* Manager Section */}
      <ManagerTable
        expenses={dummyExpenses}
        companyCurrency="INR"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}

export default App;