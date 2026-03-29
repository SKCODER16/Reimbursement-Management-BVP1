import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getConvertedAmount } from '../../services/currencyService';
import ReceiptScanner from './ReceiptScanner';

const Employee = ({ expenses = [], onSubmitExpense, employeeName }) => {
  const { currentUser, company } = useApp();

  const [form, setForm] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    category: '',
    date: '',
    paidBy: '',
    remarks: '',
    receiptImage: ''
  });

  const [activeTab, setActiveTab] = useState('submit');

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY'];
  const categories = ['Food', 'Travel', 'Hotel', 'Office Supplies', 'Medical', 'Other'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const baseAmountStr = await getConvertedAmount(form.amount, form.currency, company?.currency || 'USD');
    const baseAmountStrFixed = parseFloat(baseAmountStr);

    const newExpense = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      currency: form.currency,
      category: form.category,
      date: form.date,
      paidBy: form.paidBy,
      remarks: form.remarks,
      receiptImage: form.receiptImage,
      status: 'pending',
      baseAmount: baseAmountStrFixed,
      employeeName: employeeName || currentUser?.name //
    };
    if (onSubmitExpense) onSubmitExpense(newExpense);
    setForm({ description: '', amount: '', currency: 'USD', category: '', date: '', paidBy: '', remarks: '', receiptImage: '' });
    setActiveTab('history');
  };

  const handleScanComplete = (extractedData) => {
    setForm(prev => ({
      ...prev,
      amount: extractedData.amount || prev.amount,
      date: extractedData.date || prev.date,
      description: extractedData.description || prev.description,
      category: extractedData.category || prev.category,
      receiptImage: extractedData.receiptImage
    }));
  };

  const getStatusStyle = (status) => {
    if (status === 'approved') return { background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    if (status === 'rejected') return { background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    return { background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '28px', margin: 0, fontWeight: 700 }}>💼 Employee Center</h1>
      </div>

      <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '8px', marginBottom: '30px', width: 'fit-content' }}>
        <button onClick={() => setActiveTab('submit')}
          style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)',
            background: activeTab === 'submit' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'submit' ? 'white' : 'var(--text-muted)' }}>
          + Submit Claim
        </button>
        <button onClick={() => setActiveTab('history')}
          style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: 'var(--transition)',
            background: activeTab === 'history' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'history' ? 'white' : 'var(--text-muted)' }}>
          📋 Claim History
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className="glass-panel animate-slide-up" style={{ padding: '32px' }}>
          <h2 style={{ marginTop: 0, color: '#e2e8f0' }}>New Expense Claim</h2>
          
          <ReceiptScanner onScanComplete={handleScanComplete} />

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Description *</label>
                <input className="glass-input" style={{ width: '100%' }} name="description" value={form.description} onChange={handleChange} required placeholder="e.g. Client Dinner" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Category *</label>
                <select className="glass-input" style={{ width: '100%' }} name="category" value={form.category} onChange={handleChange} required>
                  <option style={{color:'#000'}} value="">Select category</option>
                  {categories.map(c => <option style={{color:'#000'}} key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Amount *</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input className="glass-input" style={{ flex: 1 }} name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required placeholder="0.00" />
                  <select className="glass-input" name="currency" value={form.currency} onChange={handleChange}>
                    {currencies.map(c => <option style={{color:'#000'}} key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Date *</label>
                <input className="glass-input" style={{ width: '100%', colorScheme: 'dark' }} name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Paid By</label>
                <input className="glass-input" style={{ width: '100%' }} name="paidBy" value={form.paidBy} onChange={handleChange} placeholder="Your name or Corporate Card" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Remarks</label>
                <input className="glass-input" style={{ width: '100%' }} name="remarks" value={form.remarks} onChange={handleChange} placeholder="Optional context for managers" />
              </div>
            </div>
            <button className="btn-primary" type="submit" style={{ marginTop: '32px', width: '100%', padding: '16px', fontSize: '16px' }}>
              Submit Claim →
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-panel animate-slide-up" style={{ padding: '32px' }}>
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