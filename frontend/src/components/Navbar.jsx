import React from "react";
import { GraduationCap, CalendarDays, Users, Sun, Moon } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <GraduationCap size={32} />
        <span>EduEvents</span>
      </div>

      <div className="navbar-nav">
        <button
          className={`nav-link ${activeTab === "eventos" ? "active" : ""}`}
          onClick={() => setActiveTab("eventos")}
        >
          <CalendarDays size={18} />
          <span>Eventos</span>
        </button>

        <button
          className={`nav-link ${activeTab === "participantes" ? "active" : ""}`}
          onClick={() => setActiveTab("participantes")}
        >
          <Users size={18} />
          <span>Participantes</span>
        </button>

        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
