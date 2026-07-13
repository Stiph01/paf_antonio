import { CalendarRange, Users, Award } from "lucide-react";

export default function Stats({ totalEvents, totalParticipants, totalInscriptions }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-content">
          <h3>Total Eventos</h3>
          <div className="stat-number">{totalEvents}</div>
        </div>
        <div className="stat-icon primary">
          <CalendarRange size={26} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3>Participantes Registrados</h3>
          <div className="stat-number">{totalParticipants}</div>
        </div>
        <div className="stat-icon success">
          <Users size={26} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <h3>Inscripciones Totales</h3>
          <div className="stat-number">{totalInscriptions}</div>
        </div>
        <div className="stat-icon warning">
          <Award size={26} />
        </div>
      </div>
    </div>
  );
}
