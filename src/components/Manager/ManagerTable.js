import React, { useState } from 'react';

const ManagerTable = ({ expenses, companyCurrency, onApprove, onReject }) => {
    const [comment, setComment] = useState('');

    return (
        <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', borderRadius: '16px', minHeight: '80vh' }}>
            <div style={{ borderBottom: '1px solid #334155', marginBottom: '20px', paddingBottom: '10px' }}>
                <h2 style={{ color: '#6366f1', margin: 0 }}>📋 Approvals Queue</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Review and manage employee reimbursement requests.</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}>
                <thead>
                    <tr style={{ textAlign: 'left', background: '#334155' }}>
                        <th style={{ padding: '15px' }}>Employee</th>
                        <th style={{ padding: '15px' }}>Category & Date</th>
                        <th style={{ padding: '15px' }}>Description</th>
                        <th style={{ padding: '15px' }}>Submitted Amount</th>
                        <th style={{ padding: '15px' }}>Total ({companyCurrency})</th>
                        <th style={{ padding: '15px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No pending requests found.</td></tr>
                    ) : (
                        expenses.map((exp) => (
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
                                <td style={{ padding: '15px' }}>{exp.amount} {exp.currency}</td>
                                <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                                    {exp.baseAmount} {companyCurrency}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            onChange={(e) => setComment(e.target.value)}
                                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '12px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button
                                                onClick={() => onApprove(exp.id, comment)}
                                                style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => onReject(exp.id, comment)}
                                                style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManagerTable;