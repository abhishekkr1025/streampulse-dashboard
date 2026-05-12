import { useState } from "react"
import { QueryInput  } from "../components/QueryInput"
import { ResultTable } from "../components/ResultTable"
import { ResultChart } from "../components/ResultChart"

const API = "https://unafflicted-miesha-maternally.ngrok-free.dev"

export function AskData() {
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error,   setError]   = useState(null)

  async function handleSubmit(question) {
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    document.getElementById("question-input").value = ""

    try {
      const res = await fetch(`${API}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ question }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Query failed")
      }
      const data = await res.json()
      setHistory(prev => [data, ...prev])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

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

      {/* Query input area */}
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

      {/* Loading */}
      {loading && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "16px 18px",
          marginBottom: 14,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "spin 1s linear infinite", flexShrink: 0,
          }}>
            <div style={{
              width: 13, height: 13,
              border: "2px solid rgba(99,102,241,0.3)",
              borderTop: "2px solid #6366f1",
              borderRadius: "50%",
            }} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 2 }}>
              Generating SQL with Gemini…
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Running query on BigQuery</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(248,113,113,0.05)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: 16, padding: "12px 16px",
          marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "rgba(248,113,113,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, color: "#f87171", fontWeight: 700, flexShrink: 0, marginTop: 1,
          }}>!</div>
          <span style={{ fontSize: 13, color: "#f87171" }}>{error}</span>
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
        <div style={{
          textAlign: "center", padding: "50px 20px",
          color: "rgba(255,255,255,0.12)", fontSize: 13,
        }}>
          <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.3 }}>⬡</div>
          Ask a question above to query your live BigQuery data
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  )
}