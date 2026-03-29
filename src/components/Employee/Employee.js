import React, { useState } from 'react';
import { useApp } from '../context/AppContext'; //

const Employee = ({ expenses = [], onSubmitExpense, employeeName }) => {
  const { currentUser } = useApp(); //

  const [form, setForm] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    category: '',
    date: '',
    paidBy: '',
    remarks: ''
  });

  const [activeTab, setActiveTab] = useState('submit');

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY'];
  const categories = ['Food', 'Travel', 'Hotel', 'Office Supplies', 'Medical', 'Other'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      currency: form.currency,
      category: form.category,
      date: form.date,
      paidBy: form.paidBy,
      remarks: form.remarks,
      status: 'pending',
      baseAmount: parseFloat(form.amount),
      employeeName: employeeName || currentUser?.name //
    };
    if (onSubmitExpense) onSubmitExpense(newExpense);
    setForm({ description: '', amount: '', currency: 'USD', category: '', date: '', paidBy: '', remarks: '' });
    setActiveTab('history');
  };

  const getStatusStyle = (status) => {
    if (status === 'approved') return { background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    if (status === 'rejected') return { background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    return { background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#6366f1', fontSize: '24px', margin: 0 }}>💼 Employee Portal</h1>
        {/* DYNAMIC ROLE BADGE: Replaces the hardcoded "Admin" label */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('submit')}
          style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'submit' ? '#6366f1' : '#1e293b', color: activeTab === 'submit' ? 'white' : '#94a3b8' }}>
          + Submit Expense
        </button>
        <button onClick={() => setActiveTab('history')}
          style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeTab === 'history' ? '#6366f1' : '#1e293b', color: activeTab === 'history' ? 'white' : '#94a3b8' }}>
          📋 My History
        </button>
      </div>

      {activeTab === 'submit' && (
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', border: '1px solid #334155' }}>
          <h2 style={{ marginTop: 0, color: '#e2e8f0' }}>New Expense Claim</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Description *</label>
                <input name="description" value={form.description} onChange={handleChange} required placeholder="e.g. Restaurant bill"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Amount *</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input name="amount" type="number" value={form.amount} onChange={handleChange} required placeholder="0.00"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
                  <select name="currency" value={form.currency} onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}>
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Date *</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Paid By</label>
                <input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder="Your name"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Remarks</label>
                <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Optional notes"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button type="submit"
              style={{ marginTop: '24px', width: '100%', padding: '14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Submit Expense →
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', border: '1px solid #334155' }}>
          <h2 style={{ marginTop: 0, color: '#e2e8f0' }}>My Expense History</h2>
          {expenses.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No expenses submitted yet!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  {['Description', 'Category', 'Date', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 8px', textAlign: 'left', color: '#94a3b8', fontSize: '13px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px 8px', color: '#e2e8f0' }}>{exp.description}</td>
                    <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{exp.category}</td>
                    <td style={{ padding: '12px 8px', color: '#94a3b8' }}>{exp.date}</td>
                    <td style={{ padding: '12px 8px', color: '#e2e8f0', fontWeight: 'bold' }}>{exp.amount} {exp.currency}</td>
                    <td style={{ padding: '12px 8px' }}><span style={getStatusStyle(exp.status)}>{exp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Employee;