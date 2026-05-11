// src/pages/AskData.jsx
import { useState }     from "react"
import { QueryInput  }  from "../components/QueryInput"
import { ResultTable }  from "../components/ResultTable"
import { ResultChart }  from "../components/ResultChart"

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
      const res  = await fetch(`${API}/api/ask`, {
        method:  "POST",
        headers: { "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
         },
        body:    JSON.stringify({ question })
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 500,
                     margin: 0, color: "#fff" }}>
          Ask your data
        </h1>
        <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}>
          Ask questions in plain English — Gemini writes the SQL,
          BigQuery runs it
        </p>
      </div>

      {/* Input */}
      <div style={{
        background: "#1e1e2e", border: "1px solid #2a2a3e",
        borderRadius: 12, padding: 20, marginBottom: 24
      }}>
        <QueryInput onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{
          background: "#1e1e2e", border: "1px solid #2a2a3e",
          borderRadius: 12, padding: 20, marginBottom: 16,
          color: "#555", fontSize: 13
        }}>
          <div style={{ marginBottom: 4 }}>
            Generating SQL with Gemini...
          </div>
          <div style={{ fontSize: 11 }}>Running on BigQuery...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "#2a1a1a", border: "1px solid #3a2a2a",
          borderRadius: 12, padding: 16, marginBottom: 16,
          color: "#f87171", fontSize: 13
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {history.map((result, i) => (
        <div key={i} style={{
          background: "#1e1e2e", border: "1px solid #2a2a3e",
          borderRadius: 12, padding: 20, marginBottom: 16
        }}>
          {/* Question */}
          <div style={{
            display: "flex", gap: 10,
            alignItems: "flex-start", marginBottom: 12
          }}>
            <span style={{
              background: "#3b82f6", borderRadius: "50%",
              width: 24, height: 24, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 12, flexShrink: 0
            }}>Q</span>
            <span style={{ fontSize: 14, fontWeight: 500,
                           color: "#fff" }}>
              {result.question}
            </span>
          </div>

          {/* Explanation */}
          <div style={{ fontSize: 12, color: "#555",
                        marginBottom: 16, paddingLeft: 34 }}>
            {result.explanation}
          </div>

          {/* Chart */}
          {result.chart_type !== "table" && (
            <div style={{ marginBottom: 16, paddingLeft: 34 }}>
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
            background: "#0d0d1a", borderRadius: 8,
            overflow: "hidden", marginBottom: 12
          }}>
            <ResultTable
              columns={result.columns}
              rows={result.rows}
            />
          </div>

          {/* SQL toggle */}
          <details style={{ paddingLeft: 34 }}>
            <summary style={{
              fontSize: 11, color: "#444",
              cursor: "pointer", marginBottom: 6
            }}>
              View generated SQL
            </summary>
            <pre style={{
              background: "#0d0d1a", border: "1px solid #2a2a3e",
              borderRadius: 8, padding: 12, fontSize: 11,
              color: "#888", overflowX: "auto",
              whiteSpace: "pre-wrap", marginTop: 6
            }}>
              {result.sql}
            </pre>
          </details>

          <div style={{ fontSize: 11, color: "#333",
                        marginTop: 8, paddingLeft: 34 }}>
            {result.row_count} rows returned
          </div>
        </div>
      ))}

      {history.length === 0 && !loading && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "#333", fontSize: 13
        }}>
          Ask a question above to query your live BigQuery data
        </div>
      )}
    </div>
  )
}