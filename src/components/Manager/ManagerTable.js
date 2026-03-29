import React from 'react';

const ManagerTable = ({ expenses, companyCurrency, onApprove, onReject }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '8px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Approvals to Review</h2>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', color: '#888' }}>
                        <th style={{ padding: '12px' }}>Request Owner</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Submitted Amount</th>
                        <th style={{ padding: '12px' }}>Total ({companyCurrency})</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No pending requests</td></tr>
                    ) : (
                        expenses.map((exp) => (
                            <tr key={exp.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '12px' }}>{exp.employeeName}</td>
                                <td style={{ padding: '12px' }}>{exp.category}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: '#ffa500' }}>{exp.status}</span>
                                </td>
                                <td style={{ padding: '12px' }}>{exp.amount} {exp.currency}</td>
                                <td style={{ padding: '12px', color: '#4caf50', fontWeight: 'bold' }}>
                                    {exp.convertedAmount} {companyCurrency}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => onApprove(exp.id)}
                                        style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', marginRight: '8px', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onReject(exp.id)}
                                        style={{ backgroundColor: '#c62828', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}
                                    >
                                        Reject
                                    </button>
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