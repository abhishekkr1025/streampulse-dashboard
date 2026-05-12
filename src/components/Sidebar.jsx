const NAV = [
  { id: "overview", label: "Overview",     icon: "⬡" },
  { id: "orders",   label: "Orders",        icon: "⬡" },
  { id: "fraud",    label: "Fraud alerts",  icon: "⬡" },
  { id: "askdata",  label: "Ask your data", icon: "⬡" },
]

export function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* ── Mobile top navbar ── */}
      <div style={{
        display: "none",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,18,0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 16px",
        height: 54,
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
      }} className="mobile-topbar">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
            boxShadow: "0 0 16px rgba(99,102,241,0.4)",
          }}>S</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>StreamPulse</span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "6px 10px",
            color: "#fff", fontSize: 16, cursor: "pointer",
            lineHeight: 1,
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {mobileOpen && (
        <div style={{
          display: "none",
          position: "fixed", top: 54, left: 0, right: 0, zIndex: 99,
          background: "rgba(10,10,18,0.98)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "10px 12px",
          backdropFilter: "blur(16px)",
        }} className="mobile-menu">
          {NAV.map(n => {
            const isActive = page === n.id
            return (
              <div key={n.id}
                onClick={() => { setPage(n.id); setMobileOpen(false) }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 4,
                  display: "flex", alignItems: "center", gap: 10,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.10))"
                    : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isActive ? "#6366f1" : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? "0 0 8px rgba(99,102,241,0.8)" : "none",
                }} />
                <span style={{
                  fontSize: 14, fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                }}>
                  {n.label}
                </span>
                {n.id === "fraud" && (
                  <div style={{
                    marginLeft: "auto",
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#f87171",
                    boxShadow: "0 0 6px rgba(248,113,113,0.8)",
                  }} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <div style={{
        width: 220,
        background: "linear-gradient(180deg, #0a0a12 0%, #0d0d18 100%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }} className="desktop-sidebar">
        {/* Edge glow */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 1,
          background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.3) 40%, rgba(99,102,241,0.15) 70%, transparent)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ padding: "28px 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
            }}>S</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
                StreamPulse
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 1 }}>
                Analytics
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: "0 20px 10px",
          fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)", fontWeight: 500,
        }}>Navigation</div>

        <nav style={{ padding: "0 10px", flex: 1 }}>
          {NAV.map((n) => {
            const isActive = page === n.id
            return (
              <div key={n.id} onClick={() => setPage(n.id)} style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                marginBottom: 2, display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.15s ease",
                background: isActive
                  ? "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 100%)"
                  : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                position: "relative", overflow: "hidden",
              }}>
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: 2, borderRadius: "0 2px 2px 0",
                    background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                  }} />
                )}
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: isActive ? "#6366f1" : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? "0 0 8px rgba(99,102,241,0.8)" : "none",
                }} />
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                }}>
                  {n.label}
                </span>
                {n.id === "fraud" && (
                  <div style={{
                    marginLeft: "auto",
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#f87171",
                    boxShadow: "0 0 6px rgba(248,113,113,0.8)",
                    animation: "ping 2s ease-in-out infinite",
                  }} />
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 8 }}>
          <div style={{
            padding: "10px 12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Active project
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
              streaming-pipeline
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)",
              }} />
              <span style={{ fontSize: 10, color: "rgba(34,197,94,0.7)" }}>Live</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar   { display: flex !important; }
          .mobile-menu     { display: block !important; }
        }
      `}</style>
    </>
  )
}