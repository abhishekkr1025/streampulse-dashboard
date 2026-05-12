export function ResultTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: 20, color: "#555", textAlign: "center", fontSize: 13 }}>
        No results found
      </div>
    )
  }

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "clamp(11px, 3vw, 13px)",
        minWidth: columns.length > 3 ? 400 : "unset",
      }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #2a2a3e" }}>
            {columns.map(col => (
              <th key={col} style={{
                textAlign: "left",
                padding: "8px 10px",
                color: "#555",
                fontWeight: 500,
                fontSize: "clamp(10px, 2.5vw, 12px)",
                whiteSpace: "nowrap",
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1a1a2e" }}>
              {columns.map(col => (
                <td key={col} style={{
                  padding: "8px 10px",
                  color: "#ccc",
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {typeof row[col] === "number"
  ? col.includes("revenue") || col.includes("amount") || col.includes("spend")
    ? `₹${row[col].toLocaleString("en-IN")}`
    : row[col].toLocaleString()
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