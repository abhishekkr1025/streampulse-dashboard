export function QueryInput({ onSubmit, loading }) {
  const suggestions = [
    "Top 5 cities by revenue today",
    "Most ordered product last hour?",
    "How many fraud alerts today?",
    "Total revenue today?",
    "Highest avg order value city?",
    "Revenue per minute last 30 min",
  ]

  const handleKey = (e) => {
    if (e.key === "Enter" && !loading) {
      onSubmit(e.target.value)
    }
  }

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <input
          id="question-input"
          type="text"
          placeholder="Ask anything about your data..."
          onKeyDown={handleKey}
          style={{
            width: "100%",
            padding: "13px 70px 13px 14px",
            background: "#1e1e2e",
            border: "1px solid #2a2a3e",
            borderRadius: 12,
            color: "#fff",
            fontSize: "clamp(13px, 3.5vw, 15px)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => {
            const val = document.getElementById("question-input").value
            if (val.trim()) onSubmit(val)
          }}
          disabled={loading}
          style={{
            position: "absolute", right: 8, top: "50%",
            transform: "translateY(-50%)",
            background: loading ? "#2a2a3e" : "#3b82f6",
            border: "none", borderRadius: 8,
            padding: "6px 12px",
            color: "#fff", fontSize: 13,
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {/* Suggestion chips — scrollable on mobile */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        <style>{`.suggestions-scroll::-webkit-scrollbar { display: none; }`}</style>
        {suggestions.map(s => (
          <button key={s} onClick={() => onSubmit(s)}
            disabled={loading}
            style={{
              background: "#1e1e2e",
              border: "1px solid #2a2a3e",
              borderRadius: 20,
              padding: "5px 12px",
              color: "#888",
              fontSize: "clamp(11px, 3vw, 12px)",
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}