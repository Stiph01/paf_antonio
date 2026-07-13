import { useState, useEffect } from "react";
import { X, UserPlus, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export default function InscribeModal({ event, onClose, onInscribed, allParticipants }) {
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const detailedEvent = await api.getEventById(event.id);
        const enrolled = new Set(detailedEvent.participantes.map((p) => p.id));
        setEnrolledIds(enrolled);
      } catch (err) {
        console.error("Error al obtener detalles del evento:", err);
        setError("No se pudieron cargar los datos de inscritos actuales.");
      } finally {
        setLoading(false);
      }
    }
    if (event) {
      fetchEventDetails();
    }
  }, [event]);

  // Filtrar los participantes que no estén ya inscritos
  const availableParticipants = allParticipants.filter(
    (p) => !enrolledIds.has(p.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParticipantId) {
      setError("Por favor, selecciona un participante.");
      return;
    }

    try {
      setError("");
      await api.inscribe(event.id, parseInt(selectedParticipantId));
      onInscribed(); // Notificar éxito al componente padre
    } catch (err) {
      setError(err.message || "Error al realizar la inscripción.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Inscribir Participante</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
                Inscribir participante al evento:
              </p>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--primary)", marginTop: "0.25rem" }}>
                {event.titulo}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Aforo actual: {event.inscritos} / {event.capacidad} cupos
              </p>
            </div>

            {error && (
              <div style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--danger-light)",
                color: "var(--danger)",
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
                alignItems: "center"
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0" }}>
                <div className="spinner" style={{ width: "32px", height: "32px" }}></div>
              </div>
            ) : availableParticipants.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)" }}>
                <p>No hay participantes disponibles para inscribir.</p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  (Todos los participantes registrados ya están inscritos en este evento o no hay participantes registrados).
                </p>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="participant-select">Selecciona el Participante *</label>
                <select
                  id="participant-select"
                  value={selectedParticipantId}
                  onChange={(e) => setSelectedParticipantId(e.target.value)}
                >
                  <option value="">-- Seleccionar --</option>
                  {availableParticipants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.rol} - {p.codigo})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || availableParticipants.length === 0 || event.inscritos >= event.capacidad}
            >
              <UserPlus size={16} />
              <span>Confirmar Inscripción</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
