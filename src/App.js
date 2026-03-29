import React, { useState } from 'react';
import Employee from './components/Employee/Employee.js';

function App() {
  const [expenses, setExpenses] = useState([]);

  const handleSubmitExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div>
      <Employee 
        expenses={expenses} 
        onSubmitExpense={handleSubmitExpense}
        employeeName="Sarah"
      />
    </div>
  );
}

export default App;