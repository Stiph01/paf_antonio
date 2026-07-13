import { useState, useEffect } from "react";
import { X, UserMinus, Users } from "lucide-react";
import { api } from "../services/api";

export default function ViewInscribedModal({ event, onClose, onCancelInscription }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEnrolled = async () => {
    try {
      setLoading(true);
      setError("");
      const detailedEvent = await api.getEventById(event.id);
      setParticipants(detailedEvent.participantes || []);
    } catch (err) {
      console.error("Error al obtener inscritos:", err);
      setError("Error al cargar la lista de participantes inscritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event) {
      fetchEnrolled();
    }
  }, [event]);

  const handleCancel = async (participantId) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar la inscripción de este participante?")) {
      try {
        await api.cancelInscription(event.id, participantId);
        // Volver a listar los participantes
        fetchEnrolled();
        // Notificar al componente padre para que actualice el conteo del aforo
        onCancelInscription();
      } catch (err) {
        console.error("Error al cancelar inscripción:", err);
        alert(err.message || "Error al cancelar la inscripción.");
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Participantes Inscritos</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Detalles del evento:
            </p>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.25rem" }}>
              {event.titulo}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Aforo ocupado: {participants.length} / {event.capacidad} cupos
            </p>
          </div>

          {error && (
            <div style={{
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              fontSize: "0.9rem",
              marginBottom: "1.25rem"
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
              <div className="spinner" style={{ width: "32px", height: "32px" }}></div>
            </div>
          ) : participants.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "2rem 1rem",
              backgroundColor: "var(--background)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)"
            }}>
              <Users size={36} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
              <p>Aún no hay ningún participante inscrito en este evento.</p>
            </div>
          ) : (
            <div className="enrolled-participants-list">
              {participants.map((p) => (
                <div className="enrolled-item" key={p.id}>
                  <div className="enrolled-info">
                    <h4>{p.nombre}</h4>
                    <p>{p.correo} • {p.codigo}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--primary)" }}>
                      Rol: {p.rol} | Inscrito el: {formatDate(p.fecha_inscripcion)}
                    </p>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(p.id)}
                    title="Cancelar Inscripción"
                    style={{ padding: "0.35rem" }}
                  >
                    <UserMinus size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
