import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

const TT = {
  contentStyle: {
    background: "#1e1e2e", border: "1px solid #2a2a3e",
    borderRadius: 8, fontSize: 12, color: "#fff"
  }
}
const TICK = { fontSize: 11, fill: "#555" }

export function ResultChart({ chartType, xAxis, yAxis, rows }) {
  if (!rows || rows.length === 0 || !xAxis || !yAxis) return null

  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis dataKey={xAxis} tick={TICK} />
          <YAxis tick={TICK} />
          <Tooltip {...TT} />
          <Bar dataKey={yAxis} fill="#3b82f6" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis dataKey={xAxis} tick={TICK} />
          <YAxis tick={TICK} />
          <Tooltip {...TT} />
          <Line type="monotone" dataKey={yAxis}
                stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return null
}