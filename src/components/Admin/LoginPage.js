import { useState, useEffect } from "react";

export default function LoginPage({ onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    companyName: "", name: "", email: "",
    password: "", country: "", currency: "",
    currencySymbol: "", role: "admin"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,currencies")
      .then(r => r.json())
      .then(data => {
        const sorted = data
          .filter(c => c.currencies)
          .map(c => ({
            name: c.name.common,
            currency: Object.keys(c.currencies)[0],
            symbol: Object.values(c.currencies)[0]?.symbol || ""
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
      });
  }, []);

  const handleCountry = (e) => {
    const s = countries.find(c => c.name === e.target.value);
    if (s) setForm({ ...form, country: s.name, currency: s.currency, currencySymbol: s.symbol });
  };

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return setError("Please enter a valid work email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (isLogin && (form.email === "123" || form.password === "123")) return setError("Invalid credentials.");

    const company = {
      companyName: form.companyName || "My Company",
      country: form.country,
      currency: form.currency,
      currencySymbol: form.currencySymbol
    };

    const user = {
      id: "user_" + Date.now(),
      name: form.name || form.email.split('@')[0],
      email: form.email,
      role: form.role
    };

    onNavigate(form.role + "-dashboard", user, company);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Orbs handled by mesh gradient in CSS, but keeping these adds depth */}
      
      <div className="glass-panel animate-slide-up" style={{ padding: 40, width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 24, color: "var(--primary)", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          ⬡ <span style={{ color: "#fff" }}>ReimburseIQ</span>
        </div>
        
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          {isLogin ? "Welcome back" : "Create workspace"}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 30px" }}>
          {isLogin ? "Sign in to continue to your dashboard" : "Set up your company in seconds"}
        </p>

        {!isLogin && (
          <>
            <label style={s.label}>COMPANY NAME</label>
            <input className="glass-input" style={s.fullInput} placeholder="Acme Corp"
              value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />

            <label style={s.label}>YOUR NAME</label>
            <input className="glass-input" style={s.fullInput} placeholder="Your full name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

            <label style={s.label}>COUNTRY</label>
            <select className="glass-input" style={s.fullInput} value={form.country} onChange={handleCountry}>
              <option value="" style={{ color: '#000' }}>Select country</option>
              {countries.map(c => (
                <option key={c.name} value={c.name} style={{ color: '#000' }}>{c.name} — {c.currency}</option>
              ))}
            </select>
            {form.currency && (
              <p style={{ fontSize: 12, color: "var(--success)", margin: "-4px 0 16px" }}>
                ✅ Base currency: <b>{form.currency} {form.currencySymbol}</b>
              </p>
            )}

            <label style={s.label}>ROLE</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["admin", "CFO", "manager", "employee"].map(r => (
                <button key={r} onClick={() => setForm({ ...form, role: r })}
                  style={{
                    flex: 1, padding: "10px 4px", fontSize: 13, borderRadius: 8, cursor: "pointer", fontFamily: 'Outfit', transition: 'all 0.2s',
                    background: form.role === r ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
                    border: form.role === r ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color: form.role === r ? "#fff" : "var(--text-muted)",
                  }}>
                  {r === "admin" ? "👑 Admin" : r === "CFO" ? "🏦 CFO" : r === "manager" ? "💼 Mngr" : "👤 Emp"}
                </button>
              ))}
            </div>
          </>
        )}

        <label style={s.label}>EMAIL</label>
        <input className="glass-input" style={s.fullInput} type="email" placeholder="you@company.com"
          value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />

        <label style={s.label}>PASSWORD</label>
        <input className="glass-input" style={{ ...s.fullInput, marginBottom: 0 }} type="password" placeholder="••••••"
          value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />

        {error && <p style={{ fontSize: 14, color: "var(--danger)", margin: "12px 0 0" }}>{error}</p>}

        <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: "14px", fontSize: 16 }} onClick={handleSubmit}>
          {isLogin ? "Sign In →" : "Launch Workspace 🚀"}
        </button>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginTop: 24 }}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: 500 }} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Create workspace" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1.2, marginBottom: 8, marginTop: 16 },
  fullInput: { width: "100%", marginBottom: 12 }
};