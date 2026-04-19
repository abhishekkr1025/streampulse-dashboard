import { usePolling } from "../hooks/usePolling"

const API = "https://streaming-api-516957530164.asia-south1.run.app"

export function Orders() {
  const { data: products } = usePolling(`${API}/api/top-products`, 10000)
  const { data: series   } = usePolling(`${API}/api/orders-per-minute`, 10000)

  return (
    <div>
      <h1 style={{ fontSize: 18, fontWeight: 500,
                   margin: "0 0 24px", color: "#fff" }}>
        Orders
      </h1>

      <div style={{
        background: "#1e1e2e", border: "1px solid #2a2a3e",
        borderRadius: 12, padding: 20, marginBottom: 16
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 500,
                     margin: "0 0 16px", color: "#fff" }}>
          Top products (last 1 hr)
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse",
                        fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a3e" }}>
              {["Product", "Orders", "Revenue (₹)"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 12px",
                                     color: "#555", fontWeight: 500,
                                     fontSize: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(products || []).map(p => (
              <tr key={p.product}
                  style={{ borderBottom: "1px solid #1a1a2e" }}>
                <td style={{ padding: "9px 12px", color: "#fff",
                             fontWeight: 500 }}>
                  {p.product}
                </td>
                <td style={{ padding: "9px 12px", color: "#888" }}>
                  {p.total_orders?.toLocaleString()}
                </td>
                <td style={{ padding: "9px 12px", color: "#22c55e",
                             fontWeight: 500 }}>
                  ₹{p.total_revenue?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        background: "#1e1e2e", border: "1px solid #2a2a3e",
        borderRadius: 12, padding: 20
      }}>
        <h2 style={{ fontSize: 13, fontWeight: 500,
                     margin: "0 0 16px", color: "#fff" }}>
          Recent windows
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse",
                        fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a3e" }}>
              {["Window", "City", "Orders", "Revenue (₹)", "Avg (₹)"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 12px",
                                     color: "#555", fontWeight: 500,
                                     fontSize: 12 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(series || []).slice(0, 20).map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1a1a2e" }}>
                <td style={{ padding: "9px 12px", color: "#555",
                             fontFamily: "monospace", fontSize: 11 }}>
                  {r.window_start?.slice(11, 16)}
                </td>
                <td style={{ padding: "9px 12px", color: "#fff" }}>
                  {r.city}
                </td>
                <td style={{ padding: "9px 12px", color: "#888" }}>
                  {r.total_orders}
                </td>
                <td style={{ padding: "9px 12px", color: "#22c55e" }}>
                  ₹{r.total_revenue?.toLocaleString()}
                </td>
                <td style={{ padding: "9px 12px", color: "#888" }}>
                  ₹{r.avg_order_val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}