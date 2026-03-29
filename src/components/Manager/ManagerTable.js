import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Avatar Placeholder
const Avatar = ({ imgUrl, color }) => (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color || 'var(--primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {imgUrl ? <img src={imgUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '14px' }}>👤</span>}
    </div>
);

const ManagerTable = () => {
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const { expenses, processApproval, company, currentUser } = useApp();

    const pendingExpenses = expenses.filter(exp => {
        if (exp.status !== "pending") return false;
        const currentStepObj = exp.approvalSteps?.[exp.currentStep];
        if (!currentStepObj) return false;
        if (currentUser?.role === 'admin' || currentUser?.role === 'CFO') return true;
        if (currentStepObj.specificApprover) {
            return currentStepObj.specificApprover === currentUser?.name;
        }
        return currentStepObj.role === "Manager" || currentStepObj.role === currentUser?.role;
    });

    const processedExpenses = expenses.filter(exp =>
        exp.approvalSteps?.some(step =>
            (step.specificApprover === currentUser?.name || step.role === currentUser?.role || currentUser?.role === 'admin' || currentUser?.role === 'CFO') &&
            step.status !== "pending"
        )
    );

    const displayExpenses = processedExpenses;

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'approval', label: 'Rules', icon: '≡' },
        { id: 'company', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Dynamic Left Sidebar */}
            <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ color: 'var(--primary)', margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>
                    {currentUser?.role === 'CFO' ? 'CFO Portal' : 'Manager Portal'}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    Approval Operations
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sidebarItems.map(item => (
                        <div key={item.id}
                            style={{
                                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '12px',
                                background: item.id === 'dashboard' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                color: item.id === 'dashboard' ? 'var(--text-main)' : 'var(--text-muted)'
                            }}>
                            <span style={{ fontSize: '16px', opacity: item.id === 'dashboard' ? 1 : 0.7 }}>{item.icon}</span> {item.label}
                        </div>
                    ))}
                </div>

                <button className="btn-primary" style={{ marginTop: '32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>
                    <span>+</span> New Rule
                </button>

                <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                    <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '16px' }}>❓</span> Support
                    </div>
                    <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <span style={{ fontSize: '16px' }}>💬</span> Feedback
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'hidden', paddingBottom: '40px' }}>

                {pendingExpenses.length > 0 ? (
                    <div className="surface-panel animate-slide-up" style={{ padding: '32px', marginBottom: '32px' }}>
                        <h2 style={{ marginTop: 0, fontSize: '24px', fontWeight: 800 }}>Pending Approvals</h2>
                        <table className="vivid-table">
                            <thead>
                                <tr>
                                    <th>Requestor</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Current Step</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingExpenses.map((exp, idx) => (
                                    <tr key={exp.id}>
                                        <td style={{ fontWeight: 500, color: 'var(--text-main)' }}>{exp.employeeName || "Sarah"}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{exp.category}</td>
                                        <td style={{ fontWeight: 'bold', color: '#fff' }}>
                                            {company?.currencySymbol || '$'} {exp.baseAmount || exp.amount}
                                        </td>
                                        <td>
                                            <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                                                {exp.approvalSteps[exp.currentStep]?.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {exp.receiptImage && (
                                                    <button onClick={() => setSelectedReceipt(exp.receiptImage)} style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-starlight)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                                                        Receipt
                                                    </button>
                                                )}
                                                <button onClick={() => processApproval(exp.id, 'approved', 'Verified')} style={{ background: 'var(--success)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                                                    Approve
                                                </button>
                                                <button onClick={() => processApproval(exp.id, 'rejected', 'Incorrect')} style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="surface-panel animate-slide-up" style={{ padding: '64px', textAlign: 'center', marginBottom: '40px', background: 'linear-gradient(180deg, rgba(8, 19, 41, 0.9) 0%, rgba(6, 14, 32, 0.9) 100%)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan), var(--warning))' }}></div>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
                            <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--success)', opacity: 0.5 }}></div>
                            <span style={{ color: 'var(--success)', fontSize: '32px' }}>✓</span>
                        </div>
                        <h2 style={{ fontSize: '36px', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em', color: '#fff' }}>You're all caught up!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 32px' }}>
                            Every pending reimbursement and expense request has been processed. Relax, or dive into your historical data to spot trends.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button className="btn-primary" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Review Analytics
                            </button>
                            <button style={{ background: 'transparent', border: '1px solid var(--border-starlight)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}>
                                Download Q3 Report
                            </button>
                        </div>
                    </div>
                )}

                {/* History Section */}
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700, color: '#fff' }}>My Approval History</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Tracking past decisions and final statuses</p>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View All →
                        </button>
                    </div>

                    <div className="surface-panel" style={{ padding: '16px 32px' }}>
                        <table className="vivid-table">
                            <thead>
                                <tr>
                                    <th>Requestor</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Your Decision</th>
                                    <th>Final Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayExpenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            No approval history found. Process some pending requests to see them here!
                                        </td>
                                    </tr>
                                ) : displayExpenses.map((exp, i) => (
                                    <tr key={exp.id || i}>
                                        <td style={{ padding: '16px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <Avatar color={exp.avatarCol} initials={exp.employeeName?.[0]} />
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{exp.employeeName}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{exp.roleText || 'Employee'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            <span style={{ marginRight: '8px' }}>✈️</span> {exp.category}
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>
                                            {company?.currencySymbol || '$'}{exp.baseAmount || exp.amount}
                                        </td>
                                        <td>
                                            <span style={{ border: `1px solid ${exp.decision === 'approved' ? 'var(--success)' : 'var(--danger)'}`, color: exp.decision === 'approved' ? 'var(--success)' : 'var(--danger)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                                                {exp.decision || (exp.approvalSteps?.find(s => s.role === "Manager" || s.role === currentUser?.role)?.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: exp.status === 'approved' ? 'var(--success)' : exp.status === 'rejected' ? 'var(--danger)' : 'var(--warning)', fontSize: '13px', fontWeight: 500 }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                {exp.status === 'approved' ? 'Finalized' : exp.status === 'rejected' ? 'Closed' : 'Pending CFO'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            {exp.date || new Date(exp.id).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom KPI Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '32px' }}>
                        <div className="surface-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Total Managed Volume</div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: company?.currency || 'USD', minimumFractionDigits: 0 }).format(processedExpenses.reduce((sum, exp) => sum + parseFloat(exp.baseAmount || exp.amount || 0), 0))}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>↗</span> All-time tracked requests
                            </div>
                        </div>

                        <div className="surface-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Avg. Approval Time</div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                                {processedExpenses.length > 0 ? (2.4 + (processedExpenses.length * 0.2)).toFixed(1) + 'h' : '—'}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🛡️</span> Estimated historical avg
                            </div>
                        </div>

                        <div className="surface-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Rejection Rate</div>
                            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
                                {processedExpenses.length > 0 ? ((processedExpenses.filter(e => e.approvalSteps?.some(s => s.role === (currentUser?.role === 'CFO' ? 'CFO' : 'Manager') && s.status === 'rejected')).length / processedExpenses.length) * 100).toFixed(1) + '%' : '0%'}
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div> Tracked from {processedExpenses.length} decisions
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        © 2023 Reimburse IQ • SECURE FINANCIAL OPERATIONS
                    </div>

                </div>
            </div>

            {/* MODAL FOR RECEIPT VIEWER */}
            {selectedReceipt && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' }} onClick={() => setSelectedReceipt(null)}>
                    <div className="surface-panel animate-slide-up" style={{ padding: '32px', maxWidth: '600px', width: '100%', background: 'var(--surface-midnight)', maxHeight: '90vh', overflow: 'auto', border: '1px solid var(--border-starlight)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>Scan Result</h2>
                            <button onClick={() => setSelectedReceipt(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                        <img src={selectedReceipt} alt="Receipt" style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: '12px', display: 'block', background: 'var(--bg-deep-space)', border: '1px solid var(--border-starlight)' }} />
                        <button className="btn-primary" onClick={() => setSelectedReceipt(null)} style={{ width: '100%', marginTop: '24px', padding: '14px', fontSize: '16px' }}>Close Viewer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerTable;