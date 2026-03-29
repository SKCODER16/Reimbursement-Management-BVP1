import React, { useState, useEffect, useRef } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Hotel', 'Office Supplies', 'Medical', 'Other'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'JPY'];

// ── Claude API helper ─────────────────────────────────────────────────────────
async function callClaude(messages, maxTokens = 100) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages
    })
  });
  const data = await res.json();
  return data.content[0].text.trim();
}

const Employee = ({ expenses = [], onSubmitExpense, employeeName = "Sarah" }) => {
  const [form, setForm] = useState({
    description: '', amount: '', currency: 'USD',
    category: '', date: '', paidBy: '', remarks: ''
  });
  const [autoFilled, setAutoFilled] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Category suggester
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Anomaly check
  const [isCheckingAnomaly, setIsCheckingAnomaly] = useState(false);
  const [anomalyWarning, setAnomalyWarning] = useState(null);
  const [showAnomalyConfirm, setShowAnomalyConfirm] = useState(false);
  const pendingExpenseRef = useRef(null);

  const [activeTab, setActiveTab] = useState('submit');
  const fileInputRef = useRef();

  // ── Category suggester — debounced on description ───────────────────────────
  useEffect(() => {
    const words = form.description.trim().split(/\s+/);
    if (words.length < 3 || autoFilled.category) return;

    setIsSuggesting(true);
    const timer = setTimeout(async () => {
      try {
        const text = await callClaude([{
          role: 'user',
          content: `Expense description: "${form.description}". Pick the single best category from this list: Food, Travel, Hotel, Office Supplies, Medical, Other. Reply with the category name only, nothing else.`
        }], 20);

        const cleaned = text.replace(/[^a-zA-Z ]/g, '').trim();
        if (CATEGORIES.includes(cleaned)) {
          setSuggestedCategory(cleaned);
        }
      } catch (err) {
        // silently fail — suggestion is non-critical
      } finally {
        setIsSuggesting(false);
      }
    }, 600);

    return () => { clearTimeout(timer); setIsSuggesting(false); };
  }, [form.description]);

  const acceptSuggestion = () => {
    setForm(prev => ({ ...prev, category: suggestedCategory }));
    setAutoFilled(prev => ({ ...prev, category: true }));
    setSuggestedCategory(null);
  };

  // ── Anomaly check ─────────────────────────────────────────────────────────
  const checkForAnomalies = async (expense) => {
    const history = expenses.slice(0, 5)
      .map(e => `${e.category}: ${e.amount} ${e.currency}`)
      .join(', ') || 'No prior expenses';

    const text = await callClaude([{
      role: 'user',
      content: `New expense: ${expense.amount} ${expense.currency} for ${expense.category} (${expense.description}) on ${expense.date}.
Recent history for ${employeeName}: ${history}.
Is this expense suspicious or unusually high? Reply ONLY with valid JSON, no markdown:
{"suspicious": true or false, "reason": "one sentence reason or null"}`
    }], 150);

    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  };

  // ── Form change ───────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAutoFilled(prev => ({ ...prev, [e.target.name]: false }));
    if (e.target.name === 'description') setSuggestedCategory(null);
    if (e.target.name === 'amount' || e.target.name === 'category') setAnomalyWarning(null);
  };

  // ── Submit with anomaly gate ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
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
      employee: employeeName
    };

    // Skip anomaly check if already confirmed
    if (showAnomalyConfirm) {
      doSubmit(newExpense);
      return;
    }

    setIsCheckingAnomaly(true);
    setAnomalyWarning(null);

    try {
      const check = await checkForAnomalies(newExpense);
      if (check.suspicious && check.reason) {
        setAnomalyWarning(check.reason);
        setShowAnomalyConfirm(true);
        pendingExpenseRef.current = newExpense;
        setIsCheckingAnomaly(false);
        return;
      }
    } catch (err) {
      // If anomaly check fails, proceed anyway
    }

    setIsCheckingAnomaly(false);
    doSubmit(newExpense);
  };

  const doSubmit = (expense) => {
    if (onSubmitExpense) onSubmitExpense(expense || pendingExpenseRef.current);
    setForm({ description: '', amount: '', currency: 'USD', category: '', date: '', paidBy: '', remarks: '' });
    setAutoFilled({});
    setReceiptPreview(null);
    setScanError(null);
    setAnomalyWarning(null);
    setShowAnomalyConfirm(false);
    setSuggestedCategory(null);
    pendingExpenseRef.current = null;
    setActiveTab('history');
  };

  // ── OCR receipt upload ────────────────────────────────────────────────────
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanError(null);
    setIsScanning(true);
    setReceiptPreview(URL.createObjectURL(file));

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const text = await callClaude([{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
          { type: 'text', text: `Extract from this receipt. Return ONLY valid JSON, no markdown:
{"amount": <number>, "currency": "<3-letter ISO>", "date": "<YYYY-MM-DD>", "description": "<merchant + item, max 60 chars>", "category": "<Food|Travel|Hotel|Office Supplies|Medical|Other>"}
Use null for fields you cannot determine.` }
        ]
      }], 500);

      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      const updates = {};
      const newAutoFilled = {};

      if (parsed.amount) { updates.amount = String(parsed.amount); newAutoFilled.amount = true; }
      if (parsed.currency && CURRENCIES.includes(parsed.currency)) { updates.currency = parsed.currency; newAutoFilled.currency = true; }
      if (parsed.date) { updates.date = parsed.date; newAutoFilled.date = true; }
      if (parsed.description) { updates.description = parsed.description; newAutoFilled.description = true; }
      if (parsed.category && CATEGORIES.includes(parsed.category)) { updates.category = parsed.category; newAutoFilled.category = true; }

      setForm(prev => ({ ...prev, ...updates }));
      setAutoFilled(newAutoFilled);
      setSuggestedCategory(null);
    } catch (err) {
      setScanError('Could not read receipt. Please fill in manually.');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = (field) => ({
    width: '100%', padding: '10px', borderRadius: '8px', boxSizing: 'border-box',
    border: autoFilled[field] ? '1px solid #6366f1' : '1px solid #334155',
    background: autoFilled[field] ? '#1e1b4b' : '#0f172a',
    color: 'white', transition: 'border 0.2s, background 0.2s'
  });

  const AutoBadge = ({ field }) => autoFilled[field] ? (
    <span style={{ fontSize: '10px', background: '#6366f122', color: '#818cf8', border: '1px solid #6366f144', borderRadius: '4px', padding: '1px 6px', marginLeft: 8, fontWeight: 600 }}>
      ✨ from receipt
    </span>
  ) : null;

  const getStatusStyle = (status) => {
    if (status === 'approved') return { background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    if (status === 'rejected') return { background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
    return { background: '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' };
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#6366f1', fontSize: '24px', margin: 0 }}>💼 Employee Portal</h1>
        <span style={{ background: '#1e293b', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>👤 {employeeName}</span>
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
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px', position: 'relative' }}>

          {/* Scanning overlay */}
          {isScanning && (
            <div style={{ position: 'absolute', inset: 0, background: '#0f172acc', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: 16 }}>
              <div style={{ width: 48, height: 48, border: '4px solid #334155', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, margin: 0 }}>Reading your receipt...</p>
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Claude AI is extracting the details</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Anomaly check overlay */}
          {isCheckingAnomaly && (
            <div style={{ position: 'absolute', inset: 0, background: '#0f172acc', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: 16 }}>
              <div style={{ width: 48, height: 48, border: '4px solid #334155', borderTop: '4px solid #f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600, margin: 0 }}>Checking for anomalies...</p>
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>AI is reviewing your expense</p>
            </div>
          )}

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ marginTop: 0, marginBottom: 0, color: '#e2e8f0' }}>New Expense Claim</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {scanError && <span style={{ fontSize: 12, color: '#f87171' }}>{scanError}</span>}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleReceiptUpload} />
              <button type="button" onClick={() => fileInputRef.current.click()}
                style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #6366f1', background: '#1e1b4b', color: '#818cf8', cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                📷 Scan Receipt
              </button>
            </div>
          </div>

          {/* Receipt preview */}
          {receiptPreview && (
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 14, background: '#0f172a', borderRadius: 10, padding: 12, border: '1px solid #334155' }}>
              <img src={receiptPreview} alt="Receipt" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Receipt uploaded</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                  {Object.values(autoFilled).filter(Boolean).length > 0
                    ? `${Object.values(autoFilled).filter(Boolean).length} fields auto-filled — review and edit if needed`
                    : 'Processing...'}
                </div>
                <button type="button" onClick={() => { setReceiptPreview(null); setAutoFilled({}); }}
                  style={{ marginTop: 6, fontSize: 11, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  ✕ Remove
                </button>
              </div>
            </div>
          )}

          {/* Anomaly warning banner */}
          {anomalyWarning && showAnomalyConfirm && (
            <div style={{ marginBottom: 20, background: '#451a03', border: '1px solid #f59e0b', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: 14, marginBottom: 4 }}>Unusual expense detected</div>
                  <div style={{ color: '#fde68a', fontSize: 13 }}>{anomalyWarning}</div>
                  <div style={{ color: '#92400e', fontSize: 12, marginTop: 6 }}>You can still submit — make sure this is correct.</div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>
                  Description * <AutoBadge field="description" />
                </label>
                <input name="description" value={form.description} onChange={handleChange} required placeholder="e.g. Restaurant bill"
                  style={inputStyle('description')} />
              </div>

              {/* Category with suggestion */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>
                  Category * <AutoBadge field="category" />
                  {isSuggesting && <span style={{ fontSize: 10, color: '#475569', marginLeft: 8 }}>AI thinking...</span>}
                </label>
                <select name="category" value={form.category} onChange={handleChange} required
                  style={inputStyle('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {/* AI suggestion pill */}
                {suggestedCategory && suggestedCategory !== form.category && (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>AI suggests:</span>
                    <button type="button" onClick={acceptSuggestion}
                      style={{ fontSize: 12, background: '#6366f122', color: '#818cf8', border: '1px solid #6366f144', borderRadius: 20, padding: '3px 10px', cursor: 'pointer', fontWeight: 600 }}>
                      ✦ {suggestedCategory} — tap to apply
                    </button>
                  </div>
                )}
              </div>

              {/* Amount + currency */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>
                  Amount * <AutoBadge field="amount" />
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input name="amount" type="number" value={form.amount} onChange={handleChange} required placeholder="0.00"
                    style={{ ...inputStyle('amount'), flex: 1, width: 'auto' }} />
                  <select name="currency" value={form.currency} onChange={handleChange}
                    style={{ ...inputStyle('currency'), width: 'auto', padding: '10px' }}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>
                  Date * <AutoBadge field="date" />
                </label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required
                  style={inputStyle('date')} />
              </div>

              {/* Paid By */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Paid By</label>
                <input name="paidBy" value={form.paidBy} onChange={handleChange} placeholder="Your name"
                  style={inputStyle('paidBy')} />
              </div>

              {/* Remarks */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#94a3b8', fontSize: '13px' }}>Remarks</label>
                <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Optional notes"
                  style={inputStyle('remarks')} />
              </div>
            </div>

            <button type="submit" disabled={isCheckingAnomaly}
              style={{ marginTop: '24px', width: '100%', padding: '14px', background: showAnomalyConfirm ? '#d97706' : '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: isCheckingAnomaly ? 0.6 : 1 }}>
              {isCheckingAnomaly ? 'Checking...' : showAnomalyConfirm ? '⚠️ Submit Anyway →' : 'Submit Expense →'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ marginTop: 0, color: '#e2e8f0' }}>My Expense History</h2>
          {expenses.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No expenses submitted yet!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expenses.map(exp => (
                <div key={exp.id} style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#e2e8f0', fontSize: '15px' }}>{exp.description}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '3px' }}>{exp.category} · {exp.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#e2e8f0', fontSize: '15px' }}>{exp.amount} {exp.currency}</div>
                      <div style={{ marginTop: '6px' }}><span style={getStatusStyle(exp.status)}>{exp.status}</span></div>
                    </div>
                  </div>
                  {exp.approvalQueue && exp.approvalQueue.length > 0 && (
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Approval Progress</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {exp.approvalQueue.map((step, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: step.status === 'approved' ? '#22c55e' : step.status === 'rejected' ? '#ef4444' : i === exp.currentStep ? '#6366f1' : '#334155' }} />
                              <div>
                                <span style={{ fontSize: '12px', color: step.status === 'approved' ? '#22c55e' : step.status === 'rejected' ? '#ef4444' : i === exp.currentStep ? '#6366f1' : '#94a3b8' }}>
                                  {step.approverName}
                                </span>
                                {step.comment && <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>"{step.comment}"</div>}
                              </div>
                            </div>
                            {i < exp.approvalQueue.length - 1 && <span style={{ color: '#334155', fontSize: '16px' }}>→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Employee;