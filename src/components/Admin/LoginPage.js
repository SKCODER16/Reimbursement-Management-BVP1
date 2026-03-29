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
    if (!emailRegex.test(form.email) && !form.email) return setError("Please enter a valid work email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    const company = {
      companyName: form.companyName || "Expressive Enterprise",
      country: form.country || "USA",
      currency: form.currency || "USD",
      currencySymbol: form.currencySymbol || "$"
    };

    const user = {
      id: "user_" + Date.now(),
      name: form.name || (form.email ? form.email.split('@')[0] : "DemoUser"),
      email: form.email,
      role: form.role
    };

    onNavigate(form.role + "-dashboard", user, company);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: '40px 20px', background: 'var(--bg-deep-space)', position: 'relative', overflow: 'hidden' }}>

      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(6,14,32,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      {/* Header Logo Area */}
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--surface-midnight)', border: '1px solid var(--border-starlight)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: 'var(--primary)', fontSize: '24px' }}>
          <span>c</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em', color: '#fff' }}>ReimburseIQ</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>Crystalline clarity in corporate expenses.</p>
      </div>

      {/* Main Login Card */}
      <div className="surface-panel animate-slide-up" style={{ padding: '48px', width: "100%", maxWidth: '460px', borderRadius: '32px', zIndex: 1 }}>

        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: "0 0 8px", color: '#fff' }}>
          {isLogin ? "Welcome Back" : "Create Workspace"}
        </h2>
        <p style={{ fontSize: '14px', color: "var(--text-muted)", margin: "0 0 32px" }}>
          {isLogin ? "Please enter your credentials to continue" : "Set up your company in seconds"}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {!isLogin && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={s.label}>COMPANY NAME</label>
                <div style={s.inputWrapper}>
                  <input style={s.input} placeholder="Acme Corp" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={s.label}>YOUR NAME</label>
                <div style={s.inputWrapper}>
                  <input style={s.input} placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={s.label}>COUNTRY</label>
                <div style={s.inputWrapper}>
                  <select style={{ ...s.input, appearance: 'none' }} value={form.country} onChange={handleCountry}>
                    <option value="" style={{ color: '#000' }}>Select country</option>
                    {countries.map(c => (
                      <option key={c.name} value={c.name} style={{ color: '#000' }}>{c.name} — {c.currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={s.label}>ROLE <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Hackathon Demo Select)</span></label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["admin", "CFO", "manager", "employee"].map(r => (
                    <button key={r} onClick={() => setForm({ ...form, role: r })}
                      style={{
                        flex: 1, padding: "12px 8px", fontSize: '12px', borderRadius: 'var(--radius-pill)', cursor: "pointer", fontWeight: 600, transition: 'var(--transition)',
                        background: form.role === r ? "var(--primary)" : "var(--bg-deep-space)",
                        border: form.role === r ? "1px solid var(--primary)" : "1px solid var(--border-starlight)",
                        color: form.role === r ? "#fff" : "var(--text-muted)", textTransform: 'capitalize'
                      }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                Demo Mode: Select role below and enter any password.
              </span>
            </div>
          )}

          {isLogin && (
            <div>
              <label style={s.label}>DEMO LOGIN ROLE</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["admin", "CFO", "manager", "employee"].map(r => (
                  <button key={r} onClick={() => setForm({ ...form, role: r })}
                    style={{
                      flex: 1, padding: "12px 8px", fontSize: '12px', borderRadius: 'var(--radius-pill)', cursor: "pointer", fontWeight: 600, transition: 'var(--transition)',
                      background: form.role === r ? "var(--primary)" : "var(--bg-deep-space)",
                      border: form.role === r ? "1px solid var(--primary)" : "1px solid var(--border-starlight)",
                      color: form.role === r ? "#fff" : "var(--text-muted)", textTransform: 'capitalize'
                    }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={s.label}>CORPORATE EMAIL</label>
            <div style={s.inputWrapper}>
              <span style={s.icon}>✉</span>
              <input style={s.input} type="email" placeholder="name@enterprise.com" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...s.label, marginBottom: 0 }}>PASSWORD</label>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Forgot Access?</span>
            </div>
            <div style={s.inputWrapper}>
              <span style={s.icon}>🔒</span>
              <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              <span style={{ ...s.icon, cursor: 'pointer' }}>👁</span>
            </div>
          </div>

          {isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-starlight)', background: 'var(--bg-deep-space)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Remember this workstation</span>
            </div>
          )}

          {error && <p style={{ fontSize: '13px', color: "var(--danger)", margin: 0 }}>{error}</p>}

          <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: '16px', borderRadius: 'var(--radius-pill)', fontWeight: 600, marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={handleSubmit}>
            {isLogin ? "Sign In →" : "Launch Workspace 🚀"}
          </button>

          {isLogin && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-starlight)', zIndex: 0 }}></div>
                <span style={{ position: 'relative', zIndex: 1, background: 'var(--surface-midnight)', padding: '0 16px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>OR ACCESS WITH</span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ flex: 1, padding: '12px', background: 'var(--bg-deep-space)', border: '1px solid var(--border-starlight)', borderRadius: 'var(--radius-pill)', color: '#fff', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ color: 'var(--primary)' }}>🔑</span> SSO
                </button>
                <button style={{ flex: 1, padding: '12px', background: 'var(--bg-deep-space)', border: '1px solid var(--border-starlight)', borderRadius: 'var(--radius-pill)', color: '#fff', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ color: 'var(--success)' }}>🛡️</span> Biometrics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', zIndex: 1 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 0 16px' }}>
          {isLogin ? "New to Reimburse IQ" : "Already configured?"}
        </p>
        <button style={{ background: 'transparent', border: '1px solid var(--border-starlight)', background: 'var(--surface-midnight)', padding: '12px 24px', borderRadius: 'var(--radius-pill)', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }} onClick={() => { setIsLogin(!isLogin); setError(""); }}>
          {isLogin ? "Request Onboarding" : "Back to Sign In"}
        </button>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, zIndex: 1 }}>
        <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
        <span style={{ cursor: 'pointer' }}>Terms of Service</span>
        <span style={{ cursor: 'pointer' }}>Support Portal</span>
      </div>

      {/* Testimonial Floating Card */}
      <div className="surface-panel animate-slide-up" style={{ position: 'absolute', bottom: '40px', right: '40px', width: '300px', padding: '24px', borderRadius: '24px', zIndex: 2, display: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', background: 'var(--success)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px' }}>✓</div>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>Expressive Enterprise</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 20px' }}>
          "ReimburseIQ has transformed our financial workflow. The Neon Luminary aesthetic isn't just beautiful—it's incredibly efficient."
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Mercer" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-starlight)' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Alex Mercer</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CFO, Luminary Global</div>
          </div>
        </div>
      </div>

      {/* Media Query for displaying the testimonial only on desktop. We can inject a style block here */}
      <style>{`
        @media (min-width: 1200px) {
          .surface-panel:last-child {
             display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

const s = {
  label: { display: "block", fontSize: '11px', fontWeight: 700, color: "var(--text-muted)", letterSpacing: '0.05em', marginBottom: '8px' },
  inputWrapper: { display: 'flex', alignItems: 'center', background: 'var(--bg-deep-space)', border: '1px solid var(--border-starlight)', borderRadius: 'var(--radius-pill)', padding: '0 16px', overflow: 'hidden' },
  icon: { color: 'var(--text-muted)', fontSize: '14px', flexShrink: 0 },
  input: { flex: 1, padding: '16px 12px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '15px' }
};