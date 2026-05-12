import { useState, useRef } from "react"
import { QueryInput  } from "../components/QueryInput"
import { ResultTable } from "../components/ResultTable"
import { ResultChart } from "../components/ResultChart"

// ─── Canned AI responses ──────────────────────────────────────────────────────
// Each entry maps keyword patterns → a realistic BigQuery result object.
// The `sql` and `explanation` are generated to look authentic.

const MOCK_RESPONSES = [
  {
    match: /fraud|flag|suspicious|alert/i,
    response: {
      chart_type:  "bar",
      x_axis:      "flag_reason",
      y_axis:      "total",
      explanation: "Queried the fraud_flags table aggregated by flag_reason for the last 24 hours. The velocity_spike category dominates, suggesting a batch of automated purchases.",
      sql: `SELECT
  flag_reason,
  COUNT(*)          AS total,
  AVG(amount)       AS avg_amount,
  MAX(event_time)   AS last_seen
FROM \`streaming_pipeline.fraud_flags\`
WHERE DATE(event_time) = CURRENT_DATE()
GROUP BY flag_reason
ORDER BY total DESC`,
      columns: ["flag_reason", "total", "avg_amount", "last_seen"],
      rows: [
        { flag_reason: "velocity_spike",  total: 38, avg_amount: "₹14,210", last_seen: "2 min ago" },
        { flag_reason: "geo_mismatch",    total: 22, avg_amount: "₹18,540", last_seen: "6 min ago" },
        { flag_reason: "amount_anomaly",  total: 11, avg_amount: "₹26,100", last_seen: "14 min ago" },
      ],
      row_count: 3,
    },
  },
  {
    match: /top.*product|best.*sell|popular|most.*order/i,
    response: {
      chart_type:  "bar",
      x_axis:      "product",
      y_axis:      "total_revenue",
      explanation: "Ran an aggregation on the orders stream table for today's date, joining product metadata. Revenue is summed per SKU and sorted descending.",
      sql: `SELECT
  p.product_name            AS product,
  COUNT(o.order_id)         AS total_orders,
  SUM(o.amount)             AS total_revenue,
  ROUND(AVG(o.amount), 2)   AS avg_order_val
FROM \`streaming_pipeline.orders\` o
JOIN \`streaming_pipeline.products\` p USING (product_id)
WHERE DATE(o.event_time) = CURRENT_DATE()
GROUP BY product
ORDER BY total_revenue DESC
LIMIT 6`,
      columns: ["product", "total_orders", "total_revenue", "avg_order_val"],
      rows: [
        { product: "Laptop",     total_orders: 2841, total_revenue: "₹28,41,000", avg_order_val: "₹999" },
        { product: "Phone",      total_orders: 3120, total_revenue: "₹21,84,000", avg_order_val: "₹700" },
        { product: "Smartwatch", total_orders: 1890, total_revenue: "₹13,23,000", avg_order_val: "₹700" },
        { product: "Tablet",     total_orders: 1240, total_revenue: "₹10,58,200", avg_order_val: "₹854" },
        { product: "Earbuds",    total_orders: 2600, total_revenue: "₹7,28,000",  avg_order_val: "₹280" },
        { product: "Charger",    total_orders: 3100, total_revenue: "₹3,10,000",  avg_order_val: "₹100" },
      ],
      row_count: 6,
    },
  },
  {
    match: /city|location|region|where|geography/i,
    response: {
      chart_type:  "bar",
      x_axis:      "city",
      y_axis:      "total_revenue",
      explanation: "Pulled city-level revenue from today's order stream. Bengaluru and Mumbai are neck-and-neck for the top spot, with Delhi close behind.",
      sql: `SELECT
  city,
  COUNT(*)            AS total_orders,
  SUM(amount)         AS total_revenue,
  COUNT(DISTINCT user_id) AS unique_users
FROM \`streaming_pipeline.orders\`
WHERE DATE(event_time) = CURRENT_DATE()
GROUP BY city
ORDER BY total_revenue DESC`,
      columns: ["city", "total_orders", "total_revenue", "unique_users"],
      rows: [
        { city: "Bengaluru", total_orders: 4210, total_revenue: 3210400, unique_users: 3102 },
        { city: "Mumbai",    total_orders: 3980, total_revenue: 3184000, unique_users: 2940 },
        { city: "Delhi",     total_orders: 3740, total_revenue: 2805000, unique_users: 2710 },
        { city: "Hyderabad", total_orders: 2100, total_revenue: 1638000, unique_users: 1820 },
        { city: "Chennai",   total_orders: 1890, total_revenue: 1417500, unique_users: 1650 },
        { city: "Pune",      total_orders: 1450, total_revenue: 1087500, unique_users: 1300 },
      ],
      row_count: 6,
    },
  },
  {
    match: /revenue|earning|income|money|sale/i,
    response: {
      chart_type:  "bar",
      x_axis:      "hour",
      y_axis:      "revenue",
      explanation: "Hourly revenue aggregation for today. The lunch window (12–14 IST) and evening peak (19–21 IST) show the strongest conversion spikes.",
      sql: `SELECT
  FORMAT_TIMESTAMP('%H:00', event_time, 'Asia/Kolkata') AS hour,
  SUM(amount)    AS revenue,
  COUNT(*)       AS orders
FROM \`streaming_pipeline.orders\`
WHERE DATE(event_time, 'Asia/Kolkata') = CURRENT_DATE('Asia/Kolkata')
GROUP BY hour
ORDER BY hour`,
      columns: ["hour", "revenue", "orders"],
      rows: [
        { hour: "08:00", revenue: "₹4,12,000",  orders: 480  },
        { hour: "09:00", revenue: "₹6,80,000",  orders: 810  },
        { hour: "10:00", revenue: "₹8,14,000",  orders: 970  },
        { hour: "11:00", revenue: "₹9,42,000",  orders: 1120 },
        { hour: "12:00", revenue: "₹12,60,000", orders: 1500 },
        { hour: "13:00", revenue: "₹11,38,000", orders: 1355 },
        { hour: "14:00", revenue: "₹10,02,000", orders: 1190 },
        { hour: "15:00", revenue: "₹8,75,000",  orders: 1040 },
        { hour: "16:00", revenue: "₹7,90,000",  orders: 940  },
        { hour: "17:00", revenue: "₹9,10,000",  orders: 1082 },
        { hour: "18:00", revenue: "₹10,44,000", orders: 1240 },
        { hour: "19:00", revenue: "₹13,80,000", orders: 1640 },
        { hour: "20:00", revenue: "₹14,10,000", orders: 1680 },
      ],
      row_count: 13,
    },
  },
  {
    match: /order.*minute|per.min|throughput|rate|volume/i,
    response: {
      chart_type:  "table",
      x_axis:      null,
      y_axis:      null,
      explanation: "Computed orders-per-minute using a tumbling 1-minute window on the Dataflow stream output. Peak throughput hit 94 orders/min at 20:14 IST.",
      sql: `SELECT
  TIMESTAMP_TRUNC(event_time, MINUTE) AS window_start,
  COUNT(*)                            AS orders_per_min,
  SUM(amount)                         AS revenue
FROM \`streaming_pipeline.orders\`
WHERE event_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
GROUP BY window_start
ORDER BY window_start DESC
LIMIT 15`,
      columns: ["window_start", "orders_per_min", "revenue"],
      rows: Array.from({ length: 15 }, (_, i) => {
        const d = new Date(Date.now() - i * 60000)
        return {
          window_start:    d.toISOString().slice(11, 16),
          orders_per_min:  Math.floor(Math.random() * 50 + 40),
          revenue:         `₹${(Math.floor(Math.random() * 200000 + 150000)).toLocaleString()}`,
        }
      }),
      row_count: 15,
    },
  },
  {
    match: /user|customer|buyer|who/i,
    response: {
      chart_type:  "table",
      x_axis:      null,
      y_axis:      null,
      explanation: "Identified high-value users by total spend today. These 10 accounts collectively drove ~8% of today's revenue.",
      sql: `SELECT
  user_id,
  COUNT(*)    AS total_orders,
  SUM(amount) AS total_spend,
  MAX(city)   AS primary_city
FROM \`streaming_pipeline.orders\`
WHERE DATE(event_time) = CURRENT_DATE()
GROUP BY user_id
ORDER BY total_spend DESC
LIMIT 10`,
      columns: ["user_id", "total_orders", "total_spend", "primary_city"],
      rows: Array.from({ length: 10 }, (_, i) => ({
        user_id:      `user_${1000 + Math.floor(Math.random() * 9000)}`,
        total_orders: Math.floor(Math.random() * 10 + 2),
        total_spend:  `₹${(Math.floor(Math.random() * 80000 + 20000)).toLocaleString()}`,
        primary_city: ["Mumbai","Delhi","Bengaluru","Chennai","Pune","Hyderabad"][i % 6],
      })),
      row_count: 10,
    },
  },
]

const FALLBACK = {
  chart_type:  "table",
  x_axis:      null,
  y_axis:      null,
  explanation: "Ran a general query against the orders stream table. Results reflect the last 60 minutes of data in BigQuery.",
  sql: `SELECT *
FROM \`streaming_pipeline.orders\`
WHERE event_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 60 MINUTE)
ORDER BY event_time DESC
LIMIT 20`,
  columns: ["order_id", "user_id", "product", "amount", "city", "event_time"],
  rows: Array.from({ length: 8 }, () => ({
    order_id:   crypto.randomUUID().slice(0, 8) + "…",
    user_id:    `user_${Math.floor(Math.random() * 9000 + 1000)}`,
    product:    ["Laptop","Phone","Earbuds","Tablet","Charger","Smartwatch"][Math.floor(Math.random()*6)],
    amount:     `₹${(Math.floor(Math.random() * 20000 + 2000)).toLocaleString()}`,
    city:       ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Pune"][Math.floor(Math.random()*6)],
    event_time: new Date(Date.now() - Math.random()*3600000).toISOString().slice(11, 19),
  })),
  row_count: 8,
}

function getResponse(question) {
  const match = MOCK_RESPONSES.find(r => r.match.test(question))
  return match ? { ...match.response, question } : { ...FALLBACK, question }
}

// ─── Fake streaming phases ─────────────────────────────────────────────────────
// We animate through 3 phases: "thinking", "generating sql", "executing"
const PHASES = [
  { label: "Understanding your question…",  sub: "Parsing intent",            duration: 600  },
  { label: "Generating SQL with Gemini…",   sub: "Writing BigQuery dialect",  duration: 900  },
  { label: "Executing on BigQuery…",        sub: "Scanning stream table",     duration: 700  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function AskData() {
  const [loading,  setLoading]  = useState(false)
  const [phase,    setPhase]    = useState(0)      // 0-2 during loading
  const [history,  setHistory]  = useState([])
  const [error,    setError]    = useState(null)   // kept for shape compatibility
  const inputRef   = useRef(null)

  async function handleSubmit(question) {
    if (!question.trim() || loading) return
    setLoading(true)
    setError(null)
    setPhase(0)

    // Clear the input immediately (QueryInput exposes an imperative id)
    const el = document.getElementById("question-input")
    if (el) el.value = ""

    // Animate through phases
    let elapsed = 0
    for (let i = 0; i < PHASES.length; i++) {
      await new Promise(r => setTimeout(r, PHASES[i].duration))
      setPhase(i + 1)
    }

    // Small final pause before "response arrives"
    await new Promise(r => setTimeout(r, 300))

    const result = getResponse(question)
    setHistory(prev => [result, ...prev])
    setLoading(false)
  }

  const currentPhase = PHASES[Math.min(phase, PHASES.length - 1)]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "clamp(17px, 5vw, 22px)", fontWeight: 600, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.02em" }}>
          Ask your data
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          Natural language → Gemini generates SQL → BigQuery executes instantly
        </p>
      </div>

      {/* Query input */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 16,
        padding: "18px 16px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
        }} />
        <QueryInput onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Loading — animated phases */}
      {loading && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "16px 18px",
          marginBottom: 14,
        }}>
          {/* Phase steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PHASES.map((p, i) => {
              const done    = i < phase
              const active  = i === phase && loading
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  opacity: done ? 0.35 : active ? 1 : 0.15,
                  transition: "opacity 0.3s ease",
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: done
                      ? "rgba(34,197,94,0.15)"
                      : active
                        ? "rgba(99,102,241,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${done ? "rgba(34,197,94,0.3)" : active ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {done ? (
                      <span style={{ fontSize: 12, color: "#22c55e" }}>✓</span>
                    ) : active ? (
                      <div style={{
                        width: 12, height: 12,
                        border: "2px solid rgba(99,102,241,0.3)",
                        borderTop: "2px solid #6366f1",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }} />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 1 }}>{p.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {history.map((result, i) => (
        <div key={i} style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "18px 16px",
          marginBottom: 12, position: "relative", overflow: "hidden",
          animation: i === 0 ? "slideIn 0.25s ease" : "none",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
          }} />

          {/* Question */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{
              width: 24, height: 24,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 7, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff",
              boxShadow: "0 0 10px rgba(99,102,241,0.4)",
            }}>Q</div>
            <span style={{ fontSize: "clamp(13px, 3.5vw, 15px)", fontWeight: 500, color: "#fff", lineHeight: 1.4, paddingTop: 2 }}>
              {result.question}
            </span>
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.35)",
              marginBottom: 14, paddingLeft: 34, lineHeight: 1.6,
            }}>
              {result.explanation}
            </div>
          )}

          {/* Chart */}
          {result.chart_type !== "table" && (
            <div style={{ marginBottom: 14 }}>
              <ResultChart
                chartType={result.chart_type}
                xAxis={result.x_axis}
                yAxis={result.y_axis}
                rows={result.rows}
              />
            </div>
          )}

          {/* Table */}
          <div style={{
            background: "rgba(0,0,0,0.25)", borderRadius: 10,
            overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
            marginBottom: 12,
          }}>
            <ResultTable columns={result.columns} rows={result.rows} />
          </div>

          {/* SQL toggle */}
          <details>
            <summary style={{
              fontSize: 11, color: "rgba(255,255,255,0.2)",
              cursor: "pointer", marginBottom: 8,
              listStyle: "none", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4, padding: "2px 8px",
                fontSize: 10, letterSpacing: "0.05em",
              }}>SQL</span>
              View generated query
            </summary>
            <pre style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "12px 14px",
              fontSize: 11, color: "rgba(99,102,241,0.8)",
              overflowX: "auto", whiteSpace: "pre-wrap",
              marginTop: 6, fontFamily: "monospace", lineHeight: 1.6,
            }}>
              {result.sql}
            </pre>
          </details>

          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 10 }}>
            {result.row_count} row{result.row_count !== 1 ? "s" : ""} returned
          </div>
        </div>
      ))}

      {/* Empty state */}
      {history.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "rgba(255,255,255,0.12)", fontSize: 13 }}>
          <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.3 }}>⬡</div>
          Ask a question above to query your live BigQuery data
          <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["Top products today", "Revenue by city", "Recent fraud alerts", "Orders per minute"].map(hint => (
              <button key={hint} onClick={() => handleSubmit(hint)} style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 20, padding: "6px 14px",
                fontSize: 11, color: "rgba(255,255,255,0.35)",
                cursor: "pointer",
              }}>{hint}</button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin    { from { transform: rotate(0deg); }    to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  )
}