import React from "react";
import { Calendar, Clock, MapPin, User, Eye, UserPlus, Edit, Trash2 } from "lucide-react";

export default function EventCard({ event, onEdit, onDelete, onInscribe, onViewInscribed }) {
  const percent = Math.min(Math.round((event.inscritos / event.capacidad) * 100), 100);

  // Determinar color de la barra según el porcentaje
  let progressColor = "green";
  if (percent >= 90) {
    progressColor = "red";
  } else if (percent >= 60) {
    progressColor = "orange";
  }

  // Formatear fecha legible
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    // Ajustar por zona horaria local
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-ES", options);
  };

  // Formatear hora (quitar segundos si es HH:MM:SS)
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
  };

  return (
    <div className="event-card">
      <span className={`event-badge ${event.tipo?.toLowerCase()}`}>
        {event.tipo}
      </span>

      <div className="event-card-header">
        <h3 className="event-card-title">{event.titulo}</h3>
        <div className="event-expositor">
          Expositor: {event.expositor}
        </div>
      </div>

      <div className="event-card-body">
        <p className="event-description">{event.descripcion}</p>

        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={15} />
            <span>{formatDate(event.fecha)}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={15} />
            <span>{formatTime(event.hora)} hs</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={15} />
            <span>{event.lugar}</span>
          </div>
        </div>

        <div className="capacity-container">
          <div className="capacity-info">
            <span>Inscritos: {event.inscritos}</span>
            <span>Aforo: {event.capacidad}</span>
          </div>
          <div className="capacity-bar">
            <div
              className={`capacity-fill ${progressColor}`}
              style={{ width: `${percent}%` }}
              data-testid="capacity-fill-bar"
            ></div>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", textAlign: "right" }}>
            {percent}% ocupado
          </div>
        </div>
      </div>

      <div className="event-card-footer">
        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(event)}
            title="Editar evento"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(event.id)}
            title="Eliminar evento"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.25rem" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewInscribed(event)}
            title="Ver alumnos inscritos"
          >
            <Eye size={14} />
            <span style={{ marginLeft: "2px" }}>Inscritos</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onInscribe(event)}
            disabled={event.inscritos >= event.capacidad}
            title={event.inscritos >= event.capacidad ? "Aforo completo" : "Inscribir participante"}
          >
            <UserPlus size={14} />
            <span style={{ marginLeft: "2px" }}>Inscribir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
