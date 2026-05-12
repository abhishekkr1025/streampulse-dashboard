import { usePolling } from "../hooks/usePolling"

const API = "https://unafflicted-miesha-maternally.ngrok-free.dev"

export function Fraud() {
  const { data: alerts  } = usePolling(`${API}/api/fraud-alerts`,  5000)
  const { data: summary } = usePolling(`${API}/api/fraud-summary`, 10000)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#f87171",
            boxShadow: "0 0 10px rgba(248,113,113,0.8)",
            animation: "alertPulse 1.5s ease-in-out infinite",
          }} />
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#fff", letterSpacing: "-0.02em" }}>
            Fraud alerts
          </h1>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.01em" }}>
          Real-time flags from the Dataflow fraud detection branch · Refreshes every 5s
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {(summary || []).map(s => (
          <div key={s.flag_reason} style={{
            background: "linear-gradient(135deg, rgba(248,113,113,0.08) 0%, rgba(248,113,113,0.03) 100%)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 14,
            padding: "16px 20px",
            flex: 1,
            minWidth: 140,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg, transparent, rgba(248,113,113,0.4), transparent)",
            }} />
            <div style={{
              fontSize: 10, color: "rgba(248,113,113,0.6)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              fontWeight: 500, marginBottom: 8,
            }}>
              {s.flag_reason}
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#f87171", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {s.total}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>
              avg ₹{s.avg_amount?.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts table */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(248,113,113,0.3), transparent)",
        }} />

        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500,
          }}>
            Recent flags
          </span>
          {alerts?.length > 0 && (
            <span style={{
              marginLeft: 10, fontSize: 10, fontWeight: 500,
              background: "rgba(248,113,113,0.15)",
              color: "#f87171",
              padding: "2px 8px", borderRadius: 10,
              border: "1px solid rgba(248,113,113,0.2)",
            }}>
              {alerts.length} alerts
            </span>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Order ID", "User", "Amount (₹)", "City", "Reason", "Time"].map(h => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "10px 16px",
                    color: "rgba(255,255,255,0.2)",
                    fontWeight: 500,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(alerts || []).map((a, i) => (
                <tr key={a.order_id} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  transition: "background 0.1s",
                }}>
                  <td style={{ padding: "11px 16px", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                    {a.order_id?.slice(0, 8)}…
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.5)" }}>
                    {a.user_id}
                  </td>
                  <td style={{ padding: "11px 16px", color: "#f87171", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                    ₹{a.amount?.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.7)" }}>
                    {a.city}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      background: "rgba(248,113,113,0.1)",
                      color: "#fca5a5",
                      border: "1px solid rgba(248,113,113,0.2)",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}>
                      {a.flag_reason}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", fontSize: 11 }}>
                    {a.timestamp?.slice(11, 19)}
                  </td>
                </tr>
              ))}
              {(!alerts || alerts.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 13 }}>
                    No fraud alerts detected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes alertPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        tbody tr:hover { background: rgba(248,113,113,0.03) !important; }
      `}</style>
    </div>
  )
}