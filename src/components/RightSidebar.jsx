import React from "react";
import "./RightSidebar.css";

export default function RightSidebar({ packages, onViewRoute }) {
  return (
    <div className="right-sidebar">
      <h2>Paquetes Turísticos</h2>
      <ul className="package-list">
        {packages.map((pkg, idx) => (
          <li key={idx} className="package-item">
            <div className="package-title">{pkg.name}</div>
            <div className="package-description">{pkg.description}</div>
            <div className="package-agency">Agencia: {pkg.agency}</div>
            <button onClick={() => onViewRoute(pkg)} className="view-route-btn">
              Visualizar ruta
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
