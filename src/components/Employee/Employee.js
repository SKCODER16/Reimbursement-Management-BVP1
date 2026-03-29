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
  const categories = ['Travel & Lodging', 'Food & Dining', 'Office Supplies', 'Medical', 'Other'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseAmountStr = await getConvertedAmount(form.amount || '0', form.currency, company?.currency || 'USD');
    const baseAmountStrFixed = parseFloat(baseAmountStr);

    const newExpense = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount || '0'),
      currency: form.currency,
      category: form.category,
      date: form.date,
      paidBy: form.paidBy,
      remarks: form.remarks,
      receiptImage: form.receiptImage,
      status: 'pending',
      baseAmount: baseAmountStrFixed,
      employeeName: employeeName || currentUser?.name
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
    if (status === 'approved') return { color: 'var(--success)' };
    if (status === 'rejected') return { color: 'var(--danger)' };
    return { color: 'var(--warning)' };
  };

  return (
    <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Dynamic Left Sidebar for Employee */}
      <div style={{ width: '240px', flexShrink: 0 }}>
        <h2 style={{ color: 'var(--primary)', margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>Employee Portal</h2>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Expense Management
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onClick={() => setActiveTab('submit')}
            style={{
              padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '12px',
              background: activeTab === 'submit' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeTab === 'submit' ? 'var(--text-main)' : 'var(--text-muted)'
            }}>
            <span style={{ fontSize: '16px' }}>📝</span> New Claim
          </div>
          <div onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '12px',
              background: activeTab === 'history' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeTab === 'history' ? 'var(--text-main)' : 'var(--text-muted)'
            }}>
            <span style={{ fontSize: '16px' }}>📋</span> History
          </div>
          <div style={{ padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '16px' }}>⚙️</span> Settings
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>❓</span> Support
          </div>
          <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>💬</span> Feedback
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {activeTab === 'submit' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '40px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>New Expense Claim</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: '0 0 40px' }}>Submit your reimbursement request with crystalline clarity.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '32px' }}>

              {/* Left Form Box */}
              <div className="surface-panel" style={{ padding: '32px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Description</label>
                    <input className="glass-input" style={{ width: '100%', background: 'var(--bg-deep-space)', border: 'none' }} name="description" value={form.description} onChange={handleChange} required placeholder="e.g. Lunch with Client from Tech Corp" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Category</label>
                      <select className="glass-input" style={{ width: '100%', background: 'var(--bg-deep-space)', border: 'none' }} name="category" value={form.category} onChange={handleChange} required>
                        <option style={{ color: '#000' }} value="">Select category</option>
                        {categories.map(c => <option style={{ color: '#000' }} key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Amount</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select className="glass-input" name="currency" value={form.currency} onChange={handleChange} style={{ padding: '12px 8px', background: 'var(--bg-deep-space)', border: 'none' }}>
                          {currencies.map(c => <option style={{ color: '#000' }} key={c} value={c}>{c}</option>)}
                        </select>
                        <input className="glass-input" style={{ flex: 1, background: 'var(--bg-deep-space)', border: 'none' }} name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required placeholder="0.00" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Date</label>
                      <input className="glass-input" style={{ width: '100%', background: 'var(--bg-deep-space)', border: 'none', colorScheme: 'dark' }} name="date" type="date" value={form.date} onChange={handleChange} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Paid By</label>
                      <select className="glass-input" style={{ width: '100%', background: 'var(--bg-deep-space)', border: 'none' }} name="paidBy" value={form.paidBy} onChange={handleChange}>
                        <option style={{ color: '#000' }} value="Personal Credit Card">Personal Credit Card</option>
                        <option style={{ color: '#000' }} value="Cash">Cash</option>
                        <option style={{ color: '#000' }} value="Corporate Card">Corporate Card</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Remarks</label>
                    <textarea className="glass-input" style={{ width: '100%', minHeight: '100px', background: 'var(--bg-deep-space)', border: 'none', resize: 'vertical' }} name="remarks" value={form.remarks} onChange={handleChange} placeholder="Additional details or justification..." />
                  </div>

                  <button className="btn-primary" type="submit" style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', marginTop: '16px' }}>
                    SUBMIT EXPENSE
                  </button>
                </form>
              </div>

              {/* Right Context Boxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="surface-panel" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Approval Stream</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px' }}>
                    Your request will be routed to <strong style={{ color: 'var(--text-main)' }}>{currentUser?.manager || 'a Department Lead'}</strong> for immediate review once submitted.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}>
                    <span style={{ color: 'var(--success)' }}>🛡️</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.05em' }}>TRUST SCORE: 98%</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="surface-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      ℹ️
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning)', marginBottom: '4px', textTransform: 'uppercase' }}>Max Daily</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>$150.00</div>
                  </div>
                  <div className="surface-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.2)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      ⏱️
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px', textTransform: 'uppercase' }}>Est. Payout</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>48 Hours</div>
                  </div>
                </div>

                <div className="surface-panel" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(8, 19, 41, 0.9), rgba(6, 14, 32, 0.9))', position: 'relative', overflow: 'hidden', minHeight: '180px', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'radial-gradient(circle at 100% 0%, var(--success) 0%, transparent 50%)' }}></div>
                  <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <ReceiptScanner onScanComplete={handleScanComplete} hidePreview={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-slide-up">
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 32px', letterSpacing: '-0.02em' }}>My Expense History</h1>
            <div className="surface-panel" style={{ padding: '32px' }}>
              {expenses.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No expenses submitted yet!</p>
              ) : (
                <table className="vivid-table">
                  <thead>
                    <tr>
                      {['Description', 'Category', 'Date', 'Amount', 'Status'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp.id}>
                        <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{exp.description}</td>
                        <td style={{ color: '#94a3b8' }}>{exp.category}</td>
                        <td style={{ color: '#94a3b8' }}>{exp.date}</td>
                        <td style={{ color: '#fff', fontWeight: 'bold' }}>{exp.amount} {exp.currency}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, ...getStatusStyle(exp.status) }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                            {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;