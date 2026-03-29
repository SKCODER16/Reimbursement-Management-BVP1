import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ManagerTable = () => {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const { expenses, processApproval, company, currentUser } = useApp();

    // 1. Logic for PENDING items
    const pendingExpenses = expenses.filter(exp => {
        if (exp.status !== "pending") return false;
        
        const currentStepObj = exp.approvalSteps[exp.currentStep];
        if (!currentStepObj) return false;

        // Admins and CFOs can see and approve anything
        if (currentUser?.role === 'admin' || currentUser?.role === 'CFO') return true;

        // If it's specifically assigned to this manager by name
        if (currentStepObj.specificApprover) {
            return currentStepObj.specificApprover === currentUser?.name;
        }
        
        return currentStepObj.role === "Manager" || currentStepObj.role === currentUser?.role;
    });

    // 2. Logic for HISTORY items
    const processedExpenses = expenses.filter(exp =>
        exp.approvalSteps.some(step => 
            (step.specificApprover === currentUser?.name || step.role === currentUser?.role || currentUser?.role === 'admin' || currentUser?.role === 'CFO') && 
            step.status !== "pending"
        )
    );

    return (
        <div className="animate-slide-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '28px', margin: 0, fontWeight: 700 }}>💼 Manager Approval Queue</h1>
            </div>

            <div className="glass-panel" style={{ padding: '32px', minHeight: '80vh' }}>
                {/* PENDING TABLE */}
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Employee</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Amount</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Current Step</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                <tbody>
                    {pendingExpenses.map((exp, idx) => (
                        <tr key={exp.id} className="animate-slide-up" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', animationDelay: `${idx * 0.1}s` }}>
                            <td style={{ padding: '20px 12px', fontWeight: 500 }}>{exp.employeeName || "Sarah"}</td>
                            <td style={{ padding: '20px 12px', fontWeight: 'bold' }}>
                                {company?.currencySymbol} {exp.baseAmount || exp.amount}
                                {exp.currency !== company?.currency && (
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '4px' }}>
                                        (Orig: {exp.amount} {exp.currency})
                                    </div>
                                )}
                            </td>
                            <td style={{ padding: '20px 12px', color: 'var(--text-muted)' }}>{exp.category}</td>
                            <td style={{ padding: '20px 12px' }}>
                                <span style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                    {exp.approvalSteps[exp.currentStep]?.role} (Step {exp.currentStep + 1})
                                </span>
                            </td>
                            <td style={{ padding: '20px 12px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {exp.receiptImage && (
                                        <button onClick={() => setSelectedReceipt(exp.receiptImage)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)' }}>
                                            👁️ Receipt
                                        </button>
                                    )}
                                    <button
                                        onClick={() => processApproval(exp.id, 'approved', 'Verified')}
                                        className="btn-success" style={{ padding: '10px 16px', borderRadius: '8px' }}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => processApproval(exp.id, 'rejected', 'Incorrect details')}
                                        className="btn-danger" style={{ padding: '10px 16px', borderRadius: '8px' }}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {pendingExpenses.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginTop: '20px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
                    <h3 style={{ margin: '0 0 8px', color: '#fff' }}>You're all caught up!</h3>
                    <p style={{ margin: 0 }}>No pending expenses require your approval right now.</p>
                </div>
            )}

            {/* HISTORY SECTION */}
            <div style={{ marginTop: '60px', paddingTop: '30px' }}>
                <h2 style={{ color: 'var(--text-main)', marginBottom: '24px', fontSize: '22px' }}>📜 My Approval History</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Employee</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Amount</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>My Decision</th>
                            <th style={{ padding: '16px 12px', fontWeight: 600 }}>Current Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedExpenses.map(exp => (
                            <tr key={exp.id} style={{ borderBottom: '1px solid #334155' }}>
                                <td style={{ padding: '15px' }}>{exp.employeeName || "Sarah"}</td>
                                <td style={{ padding: '15px' }}>
                                    {company?.currencySymbol} {exp.baseAmount || exp.amount}
                                    {exp.currency !== company?.currency && (
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                                            (Orig: {exp.amount} {exp.currency})
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '15px', color: exp.approvalSteps.find(s => s.role === "Manager")?.status === 'approved' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                                    {exp.approvalSteps.find(s => s.role === "Manager")?.status.toUpperCase()}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        {exp.status === 'approved' ? '✅ Final Approval' : `⏳ Pending: ${exp.approvalSteps[exp.currentStep]?.role}`}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MODAL FOR RECEIPT VIEWER */}
        {selectedReceipt && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }} onClick={() => setSelectedReceipt(null)}>
                <div className="glass-panel animate-slide-up" style={{ padding: '32px', maxWidth: '600px', width: '100%', background: 'var(--glass-bg)', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>Scan Result</h2>
                        <button onClick={() => setSelectedReceipt(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                    <img src={selectedReceipt} alt="Receipt" style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: '12px', display: 'block', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }} />
                    <button className="btn-primary" onClick={() => setSelectedReceipt(null)} style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '16px' }}>Close Viewer</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default ManagerTable;