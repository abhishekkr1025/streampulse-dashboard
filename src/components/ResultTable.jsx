export function ResultTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: 20, color: "#555",
                    textAlign: "center", fontSize: 13 }}>
        No results found
      </div>
    )
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse",
                      fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2a3e" }}>
            {columns.map(col => (
              <th key={col} style={{
                textAlign: "left", padding: "8px 12px",
                color: "#555", fontWeight: 500, fontSize: 12,
                whiteSpace: "nowrap"
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}
                style={{ borderBottom: "1px solid #1a1a2e" }}>
              {columns.map(col => (
                <td key={col} style={{
                  padding: "9px 12px", color: "#ccc"
                }}>
                  {typeof row[col] === "number"
                    ? row[col].toLocaleString()
                    : String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}