import React from 'react';
import { useApp } from '../context/AppContext';

const ManagerTable = () => {
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
        <div style={{ padding: '20px', background: '#1e293b', borderRadius: '12px', minHeight: '80vh' }}>
            <h2 style={{ color: '#6366f1', marginBottom: '20px' }}>💼 Manager Approval Queue</h2>

            {/* PENDING TABLE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #334155', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Employee</th>
                        <th style={{ padding: '12px' }}>Amount</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Current Step</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingExpenses.map(exp => (
                        <tr key={exp.id} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '12px' }}>{exp.employeeName || "Sarah"}</td>
                            <td style={{ padding: '12px' }}>
                                {company?.currencySymbol} {exp.baseAmount || exp.amount}
                                {exp.currency !== company?.currency && (
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        (Orig: {exp.amount} {exp.currency})
                                    </div>
                                )}
                            </td>
                            <td style={{ padding: '12px' }}>{exp.category}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{ background: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                    {exp.approvalSteps[exp.currentStep]?.role} (Step {exp.currentStep + 1})
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button
                                    onClick={() => processApproval(exp.id, 'approved', 'Verified')}
                                    style={{ marginRight: '8px', background: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => processApproval(exp.id, 'rejected', 'Incorrect details')}
                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {pendingExpenses.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>No pending requests.</p>
            )}

            {/* HISTORY SECTION */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #334155', paddingTop: '30px' }}>
                <h3 style={{ color: '#94a3b8', marginBottom: '15px' }}>📜 My Approval History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#6366f1', fontSize: '13px', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '15px' }}>Employee</th>
                            <th style={{ padding: '15px' }}>Amount</th>
                            <th style={{ padding: '15px' }}>My Decision</th>
                            <th style={{ padding: '15px' }}>Current Status</th>
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
    );
};

export default ManagerTable;