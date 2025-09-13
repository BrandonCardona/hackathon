import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Navbar.css";
import Conecta from "./Conecta";

function Navbar({ onVisibilityChange, isConectaView, setIsConectaView }) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            if (!isHidden) {
              setIsHidden(true);
              onVisibilityChange?.(true);
            }
          } else if (
            currentScrollY < lastScrollY.current ||
            currentScrollY <= 100
          ) {
            if (isHidden) {
              setIsHidden(false);
              onVisibilityChange?.(false);
            }
          }
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [isHidden, onVisibilityChange]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
        <div
          className="navbar-title"
          style={{ cursor: "pointer" }}
          onClick={() => setIsConectaView(false)}
        >
          TOLIRIDE
        </div>
        <div className="navbar-actions">
          <button
            onClick={() => setIsConectaView(true)}
            style={{ background: "#ff9800", color: "#fff" }}
          >
            Conecta
          </button>
        </div>
      </nav>
      {isConectaView && (
        <div
          className="conecta-modal-bg"
          onClick={() => setIsConectaView(false)}
        >
          <div className="conecta-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="conecta-close"
              onClick={() => setIsConectaView(false)}
            >
              &times;
            </button>
            <Conecta />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
