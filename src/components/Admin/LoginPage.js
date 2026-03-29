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

    // 1. Realistic Validation
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid work email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // 2. Prevent "123" dummy login
    if (isLogin && (form.email === "123" || form.password === "123")) {
      setError("Invalid credentials.");
      return;
    }

    // 3. DEFINE the missing variables here to fix the Error
    const company = {
      companyName: form.companyName || "My Company",
      country: form.country,
      currency: form.currency,
      currencySymbol: form.currencySymbol
    };

    const user = {
      id: "user_" + Date.now(),
      name: form.name || form.email.split('@')[0], // Uses the part before the @ as a name
      email: form.email,
      role: form.role
    };

    // 4. Proceed with login using the newly defined variables
    onNavigate(form.role + "-dashboard", user, company);
  };

  return (
    <div style={s.page}>
      <div style={s.orb1} /><div style={s.orb2} />
      <div style={s.card}>
        <div style={s.logo}>⬡ <span style={s.logoText}>ReimburseIQ</span></div>
        <h1 style={s.title}>{isLogin ? "Welcome back" : "Create workspace"}</h1>
        <p style={s.sub}>{isLogin ? "Sign in to continue" : "Set up your company in seconds"}</p>

        {!isLogin && (
          <>
            <label style={s.label}>COMPANY NAME</label>
            <input style={s.input} placeholder="Acme Corp"
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })} />

            <label style={s.label}>YOUR NAME</label>
            <input style={s.input} placeholder="Your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />

            <label style={s.label}>COUNTRY</label>
            <select style={s.input} value={form.country} onChange={handleCountry}>
              <option value="">Select country</option>
              {countries.map(c => (
                <option key={c.name} value={c.name}>{c.name} — {c.currency}</option>
              ))}
            </select>
            {form.currency && (
              <p style={s.currencyNote}>✅ Base currency: <b>{form.currency} {form.currencySymbol}</b></p>
            )}

            <label style={s.label}>ROLE</label>
            <div style={s.roleRow}>
              {["admin", "CFO", "manager", "employee"].map(r => (
                <button key={r} style={{ ...s.roleBtn, ...(form.role === r ? s.roleBtnActive : {}) }}
                  onClick={() => setForm({ ...form, role: r })}>
                  {r === "admin" ? "👑 Admin" : r === "CFO" ? "🏦 CFO" : r === "manager" ? "💼 Manager" : "👤 Employee"}
                </button>
              ))}
            </div>
          </>
        )}

        <label style={s.label}>EMAIL</label>
        <input style={s.input} type="email" placeholder="you@company.com"
          value={form.email}
          onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />

        <label style={s.label}>PASSWORD</label>
        <input style={s.input} type="password" placeholder="••••••"
          value={form.password}
          onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />

        {error && <p style={s.error}>{error}</p>}

        <button style={s.btn} onClick={handleSubmit}>
          {isLogin ? "Sign In →" : "Launch Workspace 🚀"}
        </button>

        <p style={s.toggle}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span style={s.toggleLink} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Create workspace" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden", padding: 20 },
  orb1: { position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", top: -150, left: -150, pointerEvents: "none" },
  orb2: { position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", bottom: -100, right: -100, pointerEvents: "none" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40, width: "100%", maxWidth: 420, position: "relative", zIndex: 1, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  logo: { fontSize: 22, color: "#6366f1", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 },
  logoText: { color: "#fff" },
  title: { fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.5px" },
  sub: { fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 24px" },
  label: { display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 6, marginTop: 14 },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  currencyNote: { fontSize: 12, color: "#10b981", margin: "6px 0 0" },
  roleRow: { display: "flex", gap: 8, marginBottom: 4 },
  roleBtn: { flex: 1, padding: "8px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "inherit" },
  roleBtnActive: { background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.5)", color: "#fff" },
  error: { fontSize: 13, color: "#ef4444", margin: "8px 0" },
  btn: { width: "100%", marginTop: 20, background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" },
  toggle: { textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14, marginTop: 20 },
  toggleLink: { color: "#6366f1", cursor: "pointer", textDecoration: "underline" },
};