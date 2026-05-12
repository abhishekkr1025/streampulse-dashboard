import { usePolling } from "../hooks/usePolling"

const API = "https://unafflicted-miesha-maternally.ngrok-free.dev"

function DataTable({ title, topBorderColor = "rgba(99,102,241,0.3)", children }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      marginBottom: 14,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${topBorderColor}, transparent)`,
      }} />
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500,
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

function Th({ children }) {
  return (
    <th style={{
      textAlign: "left", padding: "10px 16px",
      color: "rgba(255,255,255,0.2)", fontWeight: 500,
      fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  )
}

export function Orders() {
  const { data: products } = usePolling(`${API}/api/top-products`,    10000)
  const { data: series   } = usePolling(`${API}/api/orders-per-minute`, 10000)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.02em" }}>
          Orders
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          Real-time order stream and product performance
        </p>
      </div>

      {/* Top products */}
      <DataTable title="Top products — last 1 hr" topBorderColor="rgba(34,197,94,0.4)">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Orders</Th>
                <Th>Revenue (₹)</Th>
                <Th>Share</Th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p, i) => {
                const maxRev = Math.max(...(products || []).map(x => x.total_revenue || 0))
                const pct = maxRev > 0 ? Math.round((p.total_revenue / maxRev) * 100) : 0
                return (
                  <tr key={p.product} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: "#22c55e", fontWeight: 600,
                        }}>
                          {i + 1}
                        </div>
                        <span style={{ color: "#fff", fontWeight: 500 }}>{p.product}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
                      {p.total_orders?.toLocaleString()}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#22c55e", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      ₹{p.total_revenue?.toLocaleString()}
                    </td>
                    <td style={{ padding: "11px 16px", width: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          flex: 1, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", width: `${pct}%`,
                            background: "linear-gradient(90deg, #22c55e, #4ade80)",
                            borderRadius: 2,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", minWidth: 28, textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DataTable>

      {/* Recent windows */}
      <DataTable title="Recent time windows">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <Th>Window</Th>
                <Th>City</Th>
                <Th>Orders</Th>
                <Th>Revenue (₹)</Th>
                <Th>Avg (₹)</Th>
              </tr>
            </thead>
            <tbody>
              {(series || []).slice(0, 20).map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{
                    padding: "11px 16px",
                    fontFamily: "monospace", fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                  }}>
                    {r.window_start?.slice(11, 16)}
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.7)" }}>
                    {r.city}
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
                    {r.total_orders}
                  </td>
                  <td style={{ padding: "11px 16px", color: "#22c55e", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                    ₹{r.total_revenue?.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 16px", color: "rgba(255,255,255,0.35)", fontVariantNumeric: "tabular-nums" }}>
                    ₹{r.avg_order_val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataTable>

      <style>{`tbody tr:hover { background: rgba(255,255,255,0.02) !important; }`}</style>
    </div>
  )
}