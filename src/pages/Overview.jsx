import { usePolling } from "../hooks/usePolling"
import { KpiCard    } from "../components/KpiCard"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

const API = "https://unafflicted-miesha-maternally.ngrok-free.dev"
const TT  = {
  contentStyle: {
    background: "#1e1e2e", border: "1px solid #2a2a3e",
    borderRadius: 8, fontSize: 12, color: "#fff"
  }
}
const TICK = { fontSize: 10, fill: "#555" }

export function Overview() {
  const { data: kpis   } = usePolling(`${API}/api/kpis`,             5000)
  const { data: series } = usePolling(`${API}/api/orders-per-minute`, 10000)
  const { data: cities } = usePolling(`${API}/api/city-breakdown`,    15000)
  const { data: fraud  } = usePolling(`${API}/api/fraud-summary`,     15000)

  const chartData = (series || [])
    .slice().reverse()
    .map(r => ({
      time:    r.window_start?.slice(11, 16),
      orders:  r.total_orders,
      revenue: Math.round(r.total_revenue),
    }))

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0, color: "#fff" }}>
          Live order stream
        </h1>
        <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}>
          <span style={{
            display: "inline-block", width: 7, height: 7,
            borderRadius: "50%", background: "#22c55e",
            marginRight: 6, animation: "pulse 2s ease-in-out infinite"
          }}/>
          Refreshes every 5s · GCP Pub/Sub → Dataflow → BigQuery
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KpiCard label="Orders today"
                 value={kpis?.total_orders?.toLocaleString()} />
        <KpiCard label="Revenue today (₹)"
                 value={kpis?.total_revenue?.toLocaleString()} />
        <KpiCard label="Avg order value (₹)"
                 value={kpis?.avg_order_val} />
        <KpiCard label="Active cities"
                 value={kpis?.active_cities} />
        <KpiCard label="Fraud alerts"
                 value={fraud?.reduce((a, r) => a + r.total, 0) ?? 0}
                 danger />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 16, marginBottom: 16
      }}>
        <div style={{
          background: "#1e1e2e", border: "1px solid #2a2a3e",
          borderRadius: 12, padding: 20
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 500,
                       margin: "0 0 16px", color: "#fff" }}>
            Orders / minute (last 60 min)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="time" tick={TICK} interval={4} />
              <YAxis tick={TICK} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="orders"
                    stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: "#1e1e2e", border: "1px solid #2a2a3e",
          borderRadius: 12, padding: 20
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 500,
                       margin: "0 0 16px", color: "#fff" }}>
            Revenue by city (last 1 hr)
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cities || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="city" tick={TICK} />
              <YAxis tick={TICK} />
              <Tooltip {...TT} />
              <Bar dataKey="total_revenue" fill="#22c55e"
                   radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}