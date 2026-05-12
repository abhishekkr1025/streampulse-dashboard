export function KpiCard({ label, value, sub, danger, accent }) {
  const accentColor = danger
    ? { glow: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.2)", text: "#f87171", dot: "#f87171" }
    : accent === "green"
    ? { glow: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.15)", text: "#22c55e", dot: "#22c55e" }
    : { glow: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.15)", text: "#fff", dot: "#6366f1" }

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
      borderRadius: 14,
      padding: "14px 16px",
      flex: "1 1 130px",
      minWidth: 0,
      border: `1px solid ${accentColor.border}`,
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
      boxSizing: "border-box",
    }}>
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: accentColor.glow,
        pointerEvents: "none",
        filter: "blur(20px)",
      }} />

      <div style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.35)",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 500,
        position: "relative",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {label}
      </div>

      <div style={{
        fontSize: "clamp(20px, 5vw, 28px)",
        fontWeight: 600,
        color: accentColor.text,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        position: "relative",
      }}>
        {value ?? "—"}
      </div>

      {sub && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
          {sub}
        </div>
      )}

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${accentColor.dot}40, transparent)`,
      }} />
    </div>
  )
}