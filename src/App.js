import React, { useState } from 'react';
import Employee from './components/Employee/Employee';
import Admin from './components/Admin/Admin';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [currentRole, setCurrentRole] = useState('employee');

  const handleSubmitExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div>
      {/* Role Switcher - for testing */}
      <div style={{ background: '#1e293b', padding: '10px 20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setCurrentRole('employee')}
          style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: currentRole === 'employee' ? '#6366f1' : '#334155', color: 'white' }}>
          👤 Employee
        </button>
        <button onClick={() => setCurrentRole('admin')}
          style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: currentRole === 'admin' ? '#6366f1' : '#334155', color: 'white' }}>
          ⚙️ Admin
        </button>
      </div>

      {currentRole === 'employee' && (
        <Employee expenses={expenses} onSubmitExpense={handleSubmitExpense} employeeName="Sarah" />
      )}
      {currentRole === 'admin' && (
        <Admin />
      )}
    </div>
  );
}

export default App;