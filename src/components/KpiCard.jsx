export function KpiCard({ label, value, sub, danger }) {
  return (
    <div style={{
      background: "#1e1e2e", borderRadius: 12,
      padding: "18px 20px", flex: 1, minWidth: 140,
      border: "1px solid #2a2a3e"
    }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{
        fontSize: 26, fontWeight: 500,
        color: danger ? "#f87171" : "#fff"
      }}>
        {value ?? "—"}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}