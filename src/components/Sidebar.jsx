import { useState } from "react";

export default function Sidebar({ locations, onLocationSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-content">
          <div
            className="sidebar-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "1.4em",
                color: "#1976d2",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              Lugares
            </h2>
            <button
              className="sidebar-toggle"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5em",
                color: "#1976d2",
                cursor: "pointer",
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? "←" : "→"}
            </button>
          </div>
          <input
            type="text"
            placeholder="Buscar lugares..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
              margin: "12px 0 18px 0",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #bbdefb",
              fontSize: "1em",
              width: "100%",
            }}
          />
          <ul className="sidebar-list">
            {filteredLocations.map((loc, idx) => (
              <li
                key={idx}
                className="sidebar-item"
                onClick={() => onLocationSelect(loc)}
              >
                <div className="sidebar-title">{loc.name}</div>
                <div className="sidebar-description">{loc.description}</div>
                {loc.visits && (
                  <div className="sidebar-visits">Visitas: {loc.visits}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className={`sidebar-reopen ${!isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
        style={{
          position: "fixed",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "0 8px 8px 0",
          fontSize: "1.5em",
          padding: "8px 12px",
          cursor: "pointer",
          zIndex: 200,
          boxShadow: "2px 0 8px rgba(25,118,210,0.13)",
        }}
      >
        →
      </button>
    </>
  );
}
