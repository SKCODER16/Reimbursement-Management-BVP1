import React, { useState } from 'react';

const CATEGORIES = ['All', 'Travel', 'Hotel', 'Meals', 'Equipment', 'Software', 'Other'];

const defaultRule = () => ({
  id: `rule_${Date.now()}`,
  name: '',
  approvers: [],
  condition: { type: 'none', percentage: 60, specificUserId: null },
  amountThreshold: '',
  categories: [],
});

export default function ApprovalRules({ users = [] }) {
  const managerUsers = users.filter(u => u.role === 'Manager');

  const [rules, setRules] = useState([
    {
      id: 'rule_1',
      name: 'Standard Expense Rule',
      approvers: [
        { userId: '2', name: 'John', step: 1, role: 'Manager' },
      ],
      condition: { type: 'none', percentage: 60, specificUserId: null },
      amountThreshold: '',
      categories: [],
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // ── helpers ──────────────────────────────────────────────────────────────

  const startEdit = (rule) => {
    setDraft(JSON.parse(JSON.stringify(rule)));
    setEditingId(rule.id);
    setShowNewForm(false);
  };

  const startNew = () => {
    const r = defaultRule();
    setDraft(r);
    setEditingId(r.id);
    setShowNewForm(true);
  };

  const cancelEdit = () => { setEditingId(null); setDraft(null); setShowNewForm(false); };

  const saveRule = () => {
    if (!draft.name.trim()) return alert('Rule name is required.');
    if (draft.approvers.length === 0) return alert('Add at least one approver.');
    if (showNewForm) {
      setRules(prev => [...prev, draft]);
    } else {
      setRules(prev => prev.map(r => r.id === draft.id ? draft : r));
    }
    cancelEdit();
  };

  const deleteRule = (id) => {
    if (window.confirm('Delete this rule?')) setRules(prev => prev.filter(r => r.id !== id));
  };

  // ── draft mutations ───────────────────────────────────────────────────────

  const moveApprover = (index, dir) => {
    const arr = [...draft.approvers];
    const swap = index + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[index], arr[swap]] = [arr[swap], arr[index]];
    setDraft({ ...draft, approvers: arr.map((a, i) => ({ ...a, step: i + 1 })) });
  };

  const removeApprover = (index) => {
    const arr = draft.approvers.filter((_, i) => i !== index).map((a, i) => ({ ...a, step: i + 1 }));
    setDraft({ ...draft, approvers: arr });
  };

  const addApprover = (userId) => {
    if (!userId) return;
    if (draft.approvers.find(a => a.userId === userId)) return alert('Already added.');
    const u = managerUsers.find(u => String(u.id) === userId);
    if (!u) return;
    const newApprover = { userId, name: u.name, step: draft.approvers.length + 1, role: u.role };
    setDraft({ ...draft, approvers: [...draft.approvers, newApprover] });
  };

  const toggleCategory = (cat) => {
    const cats = draft.categories.includes(cat)
      ? draft.categories.filter(c => c !== cat)
      : [...draft.categories, cat];
    setDraft({ ...draft, categories: cats });
  };

  // ── styles ────────────────────────────────────────────────────────────────

  const S = {
    wrap: { fontFamily: "'DM Sans', sans-serif", color: '#e2e8f0' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 },
    subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
    btnPrimary: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
      border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600,
      cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
    },
    btnGhost: {
      background: 'transparent', color: '#94a3b8', border: '1px solid #334155',
      borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13,
    },
    btnDanger: {
      background: 'transparent', color: '#f87171', border: '1px solid #7f1d1d',
      borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
    },
    btnSmall: {
      background: '#1e293b', color: '#94a3b8', border: '1px solid #334155',
      borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12,
    },
    card: {
      background: '#1e293b', borderRadius: 12, border: '1px solid #334155',
      padding: 20, marginBottom: 14,
    },
    ruleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    ruleName: { fontSize: 16, fontWeight: 600, color: '#f1f5f9' },
    badge: (color) => ({
      display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 20, background: color + '22', color: color, marginLeft: 8,
    }),
    stepPill: {
      display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0f172a',
      border: '1px solid #334155', borderRadius: 20, padding: '4px 10px', fontSize: 12,
      color: '#94a3b8', marginRight: 6, marginTop: 6,
    },
    divider: { borderColor: '#334155', margin: '16px 0' },
    label: { fontSize: 12, fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6, display: 'block' },
    input: {
      background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
      color: '#f1f5f9', padding: '9px 12px', fontSize: 14, width: '100%', boxSizing: 'border-box',
    },
    select: {
      background: '#0f172a', border: '1px solid #334155', borderRadius: 8,
      color: '#f1f5f9', padding: '9px 12px', fontSize: 14,
    },
    approverRow: {
      display: 'flex', alignItems: 'center', gap: 10, background: '#0f172a',
      border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', marginBottom: 8,
    },
    stepNum: {
      width: 24, height: 24, borderRadius: '50%', background: '#6366f1',
      color: '#fff', fontSize: 12, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    radio: { accentColor: '#6366f1', marginRight: 6 },
    condBlock: { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 14, marginTop: 10 },
    catPill: (active) => ({
      padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
      background: active ? '#6366f122' : '#1e293b',
      border: `1px solid ${active ? '#6366f1' : '#334155'}`,
      color: active ? '#818cf8' : '#64748b',
    }),
    formActions: { display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' },
    emptyState: { textAlign: 'center', color: '#475569', padding: '40px 0', fontSize: 14 },
  };

  // ── render rule card (view mode) ──────────────────────────────────────────

  const RuleCard = ({ rule }) => (
    <div style={S.card}>
      <div style={S.ruleHeader}>
        <div>
          <span style={S.ruleName}>{rule.name}</span>
          {rule.amountThreshold && (
            <span style={S.badge('#f59e0b')}>Above ₹{Number(rule.amountThreshold).toLocaleString()}</span>
          )}
          {rule.categories.length > 0 && rule.categories.map(c => (
            <span key={c} style={S.badge('#22d3ee')}>{c}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.btnGhost} onClick={() => startEdit(rule)}>✏️ Edit</button>
          <button style={S.btnDanger} onClick={() => deleteRule(rule.id)}>Delete</button>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>APPROVAL STEPS</span>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {rule.approvers.length === 0
            ? <span style={{ fontSize: 13, color: '#475569' }}>No approvers configured</span>
            : rule.approvers.map((a, i) => (
              <React.Fragment key={a.userId}>
                <span style={S.stepPill}>
                  <span style={{ ...S.stepNum, width: 18, height: 18, fontSize: 10 }}>{a.step}</span>
                  {a.name}
                  <span style={{ color: '#475569' }}>· {a.role}</span>
                </span>
                {i < rule.approvers.length - 1 && <span style={{ color: '#334155', marginRight: 6 }}>→</span>}
              </React.Fragment>
            ))
          }
        </div>
      </div>

      {rule.condition.type !== 'none' && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#818cf8', background: '#1e1b4b', borderRadius: 6, padding: '6px 10px', display: 'inline-block' }}>
          {rule.condition.type === 'percentage' && `⚡ Auto-approve if ${rule.condition.percentage}% approve`}
          {rule.condition.type === 'specific' && `⚡ Auto-approve when specific approver signs off`}
          {rule.condition.type === 'hybrid' && `⚡ Auto-approve: ${rule.condition.percentage}% OR specific approver`}
        </div>
      )}
    </div>
  );

  // ── render edit / create form ─────────────────────────────────────────────

  const EditForm = () => (
    <div style={{ ...S.card, border: '1px solid #6366f1', background: '#1a1f35' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#818cf8', marginBottom: 20 }}>
        {showNewForm ? '+ New Approval Rule' : '✏️ Edit Rule'}
      </div>

      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Rule Name</label>
        <input
          style={S.input}
          placeholder="e.g. Standard Expense Rule"
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
        />
      </div>

      <hr style={S.divider} />

      {/* Approvers */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Sequential Approvers</label>
        {draft.approvers.length === 0 && (
          <div style={{ ...S.emptyState, padding: '16px 0' }}>No approvers yet. Add one below.</div>
        )}
        {draft.approvers.map((a, i) => (
          <div key={a.userId} style={S.approverRow}>
            <div style={S.stepNum}>{a.step}</div>
            <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{a.name}</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>{a.role}</span>
            <button style={S.btnSmall} disabled={i === 0} onClick={() => moveApprover(i, -1)}>▲</button>
            <button style={S.btnSmall} disabled={i === draft.approvers.length - 1} onClick={() => moveApprover(i, 1)}>▼</button>
            <button style={{ ...S.btnSmall, color: '#f87171' }} onClick={() => removeApprover(i)}>✕</button>
          </div>
        ))}

        {/* Add approver */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <select
            style={{ ...S.select, flex: 1 }}
            defaultValue=""
            onChange={e => { addApprover(e.target.value); e.target.value = ''; }}
          >
            <option value="" disabled>+ Add approver…</option>
            {managerUsers
              .filter(u => !draft.approvers.find(a => a.userId === String(u.id)))
              .map(u => (
                <option key={u.id} value={String(u.id)}>{u.name} ({u.role})</option>
              ))
            }
          </select>
        </div>
      </div>

      <hr style={S.divider} />

      {/* Condition */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Auto-Approve Condition</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { val: 'none', label: 'No special condition — all steps must approve' },
            { val: 'percentage', label: 'Auto-approve if __% of approvers agree' },
            { val: 'specific', label: 'Auto-approve when a specific approver signs off' },
            { val: 'hybrid', label: 'Auto-approve: percentage OR specific approver (whichever first)' },
          ].map(opt => (
            <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="radio"
                style={S.radio}
                name="cond"
                value={opt.val}
                checked={draft.condition.type === opt.val}
                onChange={() => setDraft({ ...draft, condition: { ...draft.condition, type: opt.val } })}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {(draft.condition.type === 'percentage' || draft.condition.type === 'hybrid') && (
          <div style={{ ...S.condBlock, marginTop: 10 }}>
            <label style={S.label}>Percentage threshold (%)</label>
            <input
              type="number" min={1} max={100}
              style={{ ...S.input, width: 100 }}
              value={draft.condition.percentage}
              onChange={e => setDraft({ ...draft, condition: { ...draft.condition, percentage: Number(e.target.value) } })}
            />
          </div>
        )}

        {(draft.condition.type === 'specific' || draft.condition.type === 'hybrid') && (
          <div style={S.condBlock}>
            <label style={S.label}>Specific approver</label>
            <select
              style={S.select}
              value={draft.condition.specificUserId || ''}
              onChange={e => setDraft({ ...draft, condition: { ...draft.condition, specificUserId: e.target.value } })}
            >
              <option value="">Select user…</option>
              {draft.approvers.map(a => (
                <option key={a.userId} value={a.userId}>{a.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <hr style={S.divider} />

      {/* Amount threshold */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Amount Threshold (INR) — optional</label>
        <input
          type="number"
          style={{ ...S.input, width: 200 }}
          placeholder="e.g. 5000"
          value={draft.amountThreshold}
          onChange={e => setDraft({ ...draft, amountThreshold: e.target.value })}
        />
        <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Rule applies only to expenses above this amount. Leave blank for all amounts.</div>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Apply to Categories — optional</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <button
              key={cat}
              style={S.catPill(draft.categories.includes(cat))}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Leave unselected to apply to all categories.</div>
      </div>

      <div style={S.formActions}>
        <button style={S.btnGhost} onClick={cancelEdit}>Cancel</button>
        <button style={S.btnPrimary} onClick={saveRule}>
          {showNewForm ? '✓ Create Rule' : '✓ Save Changes'}
        </button>
      </div>
    </div>
  );

  // ── main render ───────────────────────────────────────────────────────────

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Approval Rules</h2>
          <p style={S.subtitle}>{rules.length} rule{rules.length !== 1 ? 's' : ''} configured · Sequential multi-step approvals</p>
        </div>
        {!editingId && (
          <button style={S.btnPrimary} onClick={startNew}>+ New Rule</button>
        )}
      </div>

      {editingId && draft ? (
        <>
          {/* Show non-editing rules as collapsed cards */}
          {!showNewForm && rules.filter(r => r.id !== editingId).map(r => <RuleCard key={r.id} rule={r} />)}
          <EditForm />
        </>
      ) : (
        <>
          {rules.length === 0
            ? <div style={S.emptyState}>No rules yet. Click <strong>+ New Rule</strong> to create one.</div>
            : rules.map(r => <RuleCard key={r.id} rule={r} />)
          }
        </>
      )}
    </div>
  );
}