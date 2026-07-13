import React, { useState } from "react";
import { X } from "lucide-react";

export default function ParticipantForm({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "Estudiante",
    codigo: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El formato de correo es inválido";
    }
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código universitario es obligatorio";
    } else if (formData.codigo.length < 5) {
      newErrors.codigo = "El código debe tener al menos 5 caracteres";
    }

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
          <h2>Registrar Nuevo Participante</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez Ramos"
              />
              {errors.nombre && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Institucional *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="juan.perez@universidad.edu.pe"
              />
              {errors.correo && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.correo}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rol">Rol Universitario *</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente">Docente</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="codigo">Código Universitario *</label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Ej. 202310452 o D-9824"
                />
                {errors.codigo && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.codigo}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Registrar Participante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
