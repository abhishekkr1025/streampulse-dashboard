const NAV = [
  { id: "overview", label: "Overview"      },
  { id: "orders",   label: "Orders"        },
  { id: "fraud",    label: "Fraud alerts"  },
  { id: "failed",   label: "Failed events" },
  { id: "askdata",  label: "Ask your data" },
]

export function Sidebar({ page, setPage }) {
  return (
    <div style={{
      width: 200, background: "#12121e", borderRight: "1px solid #2a2a3e",
      padding: "20px 0", flexShrink: 0, display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        padding: "0 16px 20px", fontSize: 16, fontWeight: 600,
        borderBottom: "1px solid #2a2a3e", marginBottom: 12, color: "#fff"
      }}>
        <span style={{
          display: "inline-block", width: 8, height: 8,
          borderRadius: "50%", background: "#3b82f6", marginRight: 8
        }}/>
        StreamPulse
      </div>

      {NAV.map(n => (
        <div key={n.id} onClick={() => setPage(n.id)} style={{
          padding: "10px 16px", fontSize: 13, cursor: "pointer",
          fontWeight: page === n.id ? 500 : 400,
          color:      page === n.id ? "#fff" : "#666",
          background: page === n.id ? "#1e1e2e" : "transparent",
          borderRight: page === n.id ? "2px solid #3b82f6" : "none",
          transition: "all .15s"
        }}>
          {n.label}
        </div>
      ))}

      <div style={{
        marginTop: "auto", padding: "16px",
        borderTop: "1px solid #2a2a3e"
      }}>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 2 }}>
          Project
        </div>
        <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>
          streaming-pipeline-demo
        </div>
      </div>
    </div>
  )
}