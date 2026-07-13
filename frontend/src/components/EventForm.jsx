import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EventForm({ event, onSave, onClose }) {
  const [formData, setFormData] = useState({
    titulo: "",
    expositor: "",
    descripcion: "",
    tipo: "Conferencia",
    fecha: "",
    hora: "",
    lugar: "",
    capacidad: 30,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      // Si estamos editando, formatear la fecha a YYYY-MM-DD para el input date
      let formattedDate = "";
      if (event.fecha) {
        formattedDate = event.fecha.split("T")[0];
      }

      setFormData({
        titulo: event.titulo || "",
        expositor: event.expositor || "",
        descripcion: event.descripcion || "",
        tipo: event.tipo || "Conferencia",
        fecha: formattedDate,
        hora: event.hora || "",
        lugar: event.lugar || "",
        capacidad: event.capacidad || 30,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacidad" ? parseInt(value) || 0 : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio";
    if (!formData.expositor.trim()) newErrors.expositor = "El expositor es obligatorio";
    if (!formData.fecha) newErrors.fecha = "La fecha es obligatoria";
    if (!formData.hora) newErrors.hora = "La hora es obligatoria";
    if (!formData.lugar.trim()) newErrors.lugar = "El lugar es obligatorio";
    if (formData.capacidad <= 0) newErrors.capacidad = "La capacidad debe ser mayor a 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{event ? "Editar Evento Académico" : "Registrar Nuevo Evento"}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="titulo">Título del Evento *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej. Congreso Internacional de Ciberseguridad"
              />
              {errors.titulo && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.titulo}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expositor">Expositor *</label>
                <input
                  type="text"
                  id="expositor"
                  name="expositor"
                  value={formData.expositor}
                  onChange={handleChange}
                  placeholder="Nombre del docente o experto"
                />
                {errors.expositor && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.expositor}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo de Evento *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                >
                  <option value="Conferencia">Conferencia</option>
                  <option value="Taller">Taller</option>
                  <option value="Seminario">Seminario</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Detalla los temas a tratar o requisitos..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
                {errors.fecha && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.fecha}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="hora">Hora *</label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                />
                {errors.hora && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.hora}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lugar">Lugar *</label>
                <input
                  type="text"
                  id="lugar"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  placeholder="Ej. Auditorio B-101 / Zoom"
                />
                {errors.lugar && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.lugar}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="capacidad">Aforo / Capacidad *</label>
                <input
                  type="number"
                  id="capacidad"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  min={1}
                />
                {errors.capacidad && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.capacidad}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {event ? "Guardar Cambios" : "Crear Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
