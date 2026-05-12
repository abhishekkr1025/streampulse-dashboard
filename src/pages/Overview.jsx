import { usePolling } from "../hooks/usePolling"
import { KpiCard    } from "../components/KpiCard"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts"

const API = "https://unafflicted-miesha-maternally.ngrok-free.dev"

const TT = {
  contentStyle: {
    background: "rgba(13,13,26,0.95)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 10,
    fontSize: 12,
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
  },
  labelStyle: { color: "rgba(255,255,255,0.5)", fontSize: 11 },
  cursor: { stroke: "rgba(99,102,241,0.3)", strokeWidth: 1 },
}

const TICK = { fontSize: 10, fill: "rgba(255,255,255,0.25)", fontFamily: "inherit" }
const GRID = { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.04)" }

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
      }} />
      <h2 style={{
        fontSize: 12, fontWeight: 500, margin: "0 0 20px",
        color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export function Overview() {
  const { data: kpis   } = usePolling(`${API}/api/kpis`,              5000)
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

  const totalFraud = fraud?.reduce((a, r) => a + r.total, 0) ?? 0

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#fff", letterSpacing: "-0.02em" }}>
            Live order stream
          </h1>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 20, padding: "3px 10px",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,1)",
              animation: "livePulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Live
            </span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.01em" }}>
          GCP Pub/Sub → Dataflow → BigQuery · Refreshes every 5s
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <KpiCard label="Orders today"        value={kpis?.total_orders?.toLocaleString()} />
        <KpiCard label="Revenue today"       value={kpis?.total_revenue ? `₹${kpis.total_revenue.toLocaleString()}` : "—"} accent="green" />
        <KpiCard label="Avg order value"     value={kpis?.avg_order_val ? `₹${kpis.avg_order_val}` : "—"} />
        <KpiCard label="Active cities"       value={kpis?.active_cities} />
        <KpiCard label="Fraud alerts"        value={totalFraud} danger />
      </div>

      {/* Charts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <ChartCard title="Orders / minute — last 60 min">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="time" tick={TICK} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={(v) => [v, "Orders"]} />
              <Area
                type="monotone" dataKey="orders"
                stroke="#6366f1" strokeWidth={2}
                fill="url(#blueGrad)" dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by city — last 1 hr">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cities || []} barSize={28}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="city" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={(v) => [`₹${v?.toLocaleString()}`, "Revenue"]} />
              <Bar
                dataKey="total_revenue"
                radius={[6, 6, 0, 0]}
                fill="url(#greenGrad)"
              >
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,1); }
          50% { opacity: 0.6; box-shadow: 0 0 4px rgba(34,197,94,0.5); }
        }
      `}</style>
    </div>
  )
}