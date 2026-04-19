import { usePolling } from "../hooks/usePolling"

const API = "https://streaming-api-516957530164.asia-south1.run.app"

export function Fraud() {
  const { data: alerts  } = usePolling(`${API}/api/fraud-alerts`,  5000)
  const { data: summary } = usePolling(`${API}/api/fraud-summary`, 10000)

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 500,
                   margin: "0 0 6px", color: "#fff" }}>
        Fraud alerts
      </h1>
      <p style={{ fontSize: 12, color: "#555", margin: "0 0 24px" }}>
        Real-time flags from the Dataflow fraud detection branch
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(summary || []).map(s => (
          <div key={s.flag_reason} style={{
            background: "#2a1a1a", border: "1px solid #3a2a2a",
            borderRadius: 10, padding: "12px 18px"
          }}>
            <div style={{ fontSize: 11, color: "#f87171",
                          marginBottom: 4 }}>
              {s.flag_reason}
            </div>
            <div style={{ fontSize: 22, fontWeight: 500,
                          color: "#f87171" }}>
              {s.total}
            </div>
            <div style={{ fontSize: 11, color: "#7a4a4a",
                          marginTop: 2 }}>
              avg ₹{s.avg_amount}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "#1e1e2e", border: "1px solid #2a2a3e",
        borderRadius: 12, padding: 20
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse",
                        fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a3e" }}>
              {["Order ID","User","Amount (₹)","City","Reason","Time"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 12px",
                                     color: "#555", fontWeight: 500,
                                     fontSize: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(alerts || []).map(a => (
              <tr key={a.order_id}
                  style={{ borderBottom: "1px solid #1a1a2e" }}>
                <td style={{ padding: "9px 12px", fontFamily: "monospace",
                             fontSize: 11, color: "#555" }}>
                  {a.order_id?.slice(0, 8)}…
                </td>
                <td style={{ padding: "9px 12px", color: "#888" }}>
                  {a.user_id}
                </td>
                <td style={{ padding: "9px 12px", color: "#f87171",
                             fontWeight: 500 }}>
                  ₹{a.amount?.toLocaleString()}
                </td>
                <td style={{ padding: "9px 12px", color: "#fff" }}>
                  {a.city}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <span style={{
                    background: "#2a1a1a", color: "#f87171",
                    padding: "2px 8px", borderRadius: 5, fontSize: 11
                  }}>
                    {a.flag_reason}
                  </span>
                </td>
                <td style={{ padding: "9px 12px", color: "#555",
                             fontFamily: "monospace", fontSize: 11 }}>
                  {a.timestamp?.slice(11, 19)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}