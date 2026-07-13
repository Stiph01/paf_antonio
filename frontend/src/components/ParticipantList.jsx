import React from "react";
import { User, Trash2, Search, UserPlus } from "lucide-react";

export default function ParticipantList({
  participants,
  searchQuery,
  onSearchChange,
  onAddClick,
  onDeleteParticipant,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="action-bar">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar participante por nombre, correo o código..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddClick}>
          <UserPlus size={18} />
          <span>Nuevo Participante</span>
        </button>
      </div>

      {participants.length === 0 ? (
        <div className="empty-state">
          <User size={48} />
          <h3>No se encontraron participantes</h3>
          <p>
            {searchQuery
              ? "Prueba con otra búsqueda o limpia el filtro."
              : "Aún no hay participantes registrados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Eventos Inscritos</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.correo}</td>
                  <td>
                    <span className={`role-badge ${p.rol?.toLowerCase()}`}>
                      {p.rol}
                    </span>
                  </td>
                  <td>
                    <strong>{p.total_eventos || 0}</strong> eventos
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteParticipant(p.id)}
                      title="Eliminar participante"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
