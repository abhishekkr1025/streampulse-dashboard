import { useState } from "react"
import { Sidebar  } from "./components/Sidebar"
import { Overview } from "./pages/Overview"
import { Orders   } from "./pages/Orders"
import { Fraud    } from "./pages/Fraud"

export default function App() {
  const [page, setPage] = useState("overview")

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d1a",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#fff", display: "flex"
    }}>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #12121e; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 2px; }
      `}</style>

      <Sidebar page={page} setPage={setPage} />

      <div style={{ flex: 1, padding: "28px 32px",
                    minWidth: 0, overflowY: "auto" }}>
        {page === "overview" && <Overview />}
        {page === "orders"   && <Orders   />}
        {page === "fraud"    && <Fraud    />}
      </div>
    </div>
  )
}