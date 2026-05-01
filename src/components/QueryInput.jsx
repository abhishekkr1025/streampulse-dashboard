export function QueryInput({ onSubmit, loading }) {
  const suggestions = [
    "Show me top 5 cities by revenue today",
    "Which product has the most orders in the last hour?",
    "How many fraud alerts were there today?",
    "What is the total revenue today?",
    "Which city has the highest average order value?",
    "Show me revenue per minute for the last 30 minutes",
  ]

  const handleKey = (e) => {
    if (e.key === "Enter" && !loading) {
      onSubmit(e.target.value)
    }
  }

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          id="question-input"
          type="text"
          placeholder="Ask anything about your data..."
          onKeyDown={handleKey}
          style={{
            width: "100%", padding: "14px 50px 14px 16px",
            background: "#1e1e2e", border: "1px solid #2a2a3e",
            borderRadius: 12, color: "#fff", fontSize: 15,
            outline: "none"
          }}
        />
        <button
          onClick={() => {
            const val = document.getElementById("question-input").value
            if (val.trim()) onSubmit(val)
          }}
          disabled={loading}
          style={{
            position: "absolute", right: 10, top: "50%",
            transform: "translateY(-50%)",
            background: loading ? "#2a2a3e" : "#3b82f6",
            border: "none", borderRadius: 8, padding: "6px 14px",
            color: "#fff", fontSize: 13, cursor: "pointer"
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {/* Suggestion chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => onSubmit(s)}
            disabled={loading}
            style={{
              background: "#1e1e2e", border: "1px solid #2a2a3e",
              borderRadius: 20, padding: "5px 12px",
              color: "#888", fontSize: 12, cursor: "pointer"
            }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}