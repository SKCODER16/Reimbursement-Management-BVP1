import React, { useState } from 'react';

// Convert any currency to INR using rates fetched relative to INR base
// rates.USD = 0.012 means 1 INR = 0.012 USD, so 1 USD = 1/0.012 INR
function convertToINR(amount, fromCurrency, rates) {
  if (!fromCurrency || fromCurrency === 'INR') return amount;
  if (!rates || !rates[fromCurrency]) return amount;
  const inrPerUnit = 1 / rates[fromCurrency];
  return Math.round(amount * inrPerUnit);
}

const ManagerTable = ({ expenses, currentManagerName, companyCurrency, exchangeRates, onApprove, onReject }) => {
  const [comments, setComments] = useState({});

  const myExpenses = expenses.filter(exp => {
    if (exp.status !== 'pending') return false;
    const currentApprover = exp.approvalQueue?.[exp.currentStep];
    return currentApprover?.approverName === currentManagerName
      && currentApprover?.status === 'pending';
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', borderRadius: '16px', minHeight: '80vh' }}>
      <div style={{ borderBottom: '1px solid #334155', marginBottom: '20px', paddingBottom: '10px' }}>
        <h2 style={{ color: '#6366f1', margin: 0 }}>📋 Approvals Queue</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Showing expenses waiting for: <strong style={{ color: 'white' }}>{currentManagerName}</strong>
          {Object.keys(exchangeRates).length > 0 && (
            <span style={{ marginLeft: 12, fontSize: 12, color: '#22c55e' }}>✓ Live rates loaded</span>
          )}
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: '#334155' }}>
            {['Employee', 'Category & Date', 'Description', 'Submitted Amount', `Total (${companyCurrency})`, 'Approval Progress', 'Actions'].map(h => (
              <th key={h} style={{ padding: '15px', fontSize: '13px', color: '#94a3b8' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {myExpenses.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No pending requests for you.
              </td>
            </tr>
          ) : (
            myExpenses.map(exp => {
              const convertedAmount = convertToINR(exp.amount, exp.currency, exchangeRates);
              const isForeign = exp.currency && exp.currency !== 'INR';

              return (
                <tr key={exp.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold' }}>{exp.employee}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Paid by: {exp.paidBy || 'Self'}</div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ background: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{exp.category}</span>
                    <div style={{ fontSize: '12px', marginTop: '5px', color: '#94a3b8' }}>{exp.date}</div>
                  </td>
                  <td style={{ padding: '15px', color: '#e2e8f0' }}>{exp.description}</td>

                  {/* Original submitted amount */}
                  <td style={{ padding: '15px' }}>
                    <span style={{ color: isForeign ? '#f59e0b' : '#e2e8f0', fontWeight: isForeign ? 600 : 400 }}>
                      {exp.amount} {exp.currency}
                    </span>
                  </td>

                  {/* Converted to INR with tooltip */}
                  <td style={{ padding: '15px' }}>
                    <span
                      title={isForeign ? `Original: ${exp.amount} ${exp.currency} → ₹${convertedAmount.toLocaleString('en-IN')} INR` : ''}
                      style={{
                        color: '#22c55e',
                        fontWeight: 'bold',
                        cursor: isForeign ? 'help' : 'default',
                        borderBottom: isForeign ? '1px dashed #22c55e' : 'none',
                      }}
                    >
                      ₹{convertedAmount.toLocaleString('en-IN')}
                    </span>
                    {isForeign && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: 2 }}>
                        hover for original
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '15px' }}>
                    {exp.approvalQueue?.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                          background: step.status === 'approved' ? '#22c55e'
                            : step.status === 'rejected' ? '#ef4444'
                            : i === exp.currentStep ? '#6366f1'
                            : '#334155'
                        }} />
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {step.approverName}
                          {step.status !== 'pending' && ` (${step.status})`}
                          {step.comment && ` — "${step.comment}"`}
                        </span>
                      </div>
                    ))}
                  </td>

                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comments[exp.id] || ''}
                        onChange={e => setComments({ ...comments, [exp.id]: e.target.value })}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '12px' }}
                      />
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => onApprove(exp.id, comments[exp.id] || '')}
                          style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' }}>
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(exp.id, comments[exp.id] || '')}
                          disabled={!comments[exp.id]?.trim()}
                          style={{ flex: 1, backgroundColor: comments[exp.id]?.trim() ? '#ef4444' : '#475569', color: 'white', border: 'none', padding: '8px', cursor: comments[exp.id]?.trim() ? 'pointer' : 'not-allowed', borderRadius: '6px', fontWeight: 'bold' }}>
                          Reject
                        </button>
                      </div>
                      <div style={{ fontSize: '10px', color: '#475569' }}>* Comment required to reject</div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerTable;