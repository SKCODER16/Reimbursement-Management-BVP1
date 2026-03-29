import React, { useState } from 'react';
import ManagerTable from './components/Manager/ManagerTable';

function App() {
  // Mock data representing what Person B (Employee) will eventually send you
  const [dummyExpenses, setDummyExpenses] = useState([
    {
      id: 1,
      employeeName: 'Sarah',
      category: 'Food',
      status: 'pending',
      amount: 50,
      currency: 'USD',
      convertedAmount: 4200 // This will eventually be calculated by your service
    },
    {
      id: 2,
      employeeName: 'John',
      category: 'Travel',
      status: 'pending',
      amount: 100,
      currency: 'EUR',
      convertedAmount: 8900
    }
  ]);

  const handleApprove = (id) => {
    console.log("Approved expense:", id);
    setDummyExpenses(dummyExpenses.filter(exp => exp.id !== id));
  };

  const handleReject = (id) => {
    console.log("Rejected expense:", id);
    setDummyExpenses(dummyExpenses.filter(exp => exp.id !== id));
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <h1>Reimbursement Management</h1>
      {/* Passing props to your ManagerTable */}
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