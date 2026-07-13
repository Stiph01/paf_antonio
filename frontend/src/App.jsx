import React, { useState, useEffect } from "react";
import { Plus, Search, Calendar, Users, X, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import EventCard from "./components/EventCard";
import EventForm from "./components/EventForm";
import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import InscribeModal from "./components/InscribeModal";
import ViewInscribedModal from "./components/ViewInscribedModal";
import { api } from "./services/api";

export default function App() {
  // Estados de navegación e interfaz
  const [activeTab, setActiveTab] = useState("eventos");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de datos
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);

  // Filtros de búsqueda (Eventos)
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");

  // Filtros de búsqueda (Participantes)
  const [participantSearchQuery, setParticipantSearchQuery] = useState("");

  // Control de Modales
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [inscribingEvent, setInscribingEvent] = useState(null);
  const [viewingInscribedEvent, setViewingInscribedEvent] = useState(null);

  // Sistema de Toasts (Notificaciones flotantes)
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Carga inicial de datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Cargar eventos y participantes de manera paralela
      const [eventsData, participantsData] = await Promise.all([
        api.getEvents(),
        api.getParticipants(),
      ]);

      setEvents(eventsData);
      setParticipants(participantsData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudo establecer conexión con el backend o la base de datos.");
      showToast("danger", "Error de Conexión", "Por favor, verifica que el backend y MySQL estén encendidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Operaciones de Eventos ---
  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        // Modo Edición
        await api.updateEvent(editingEvent.id, eventData);
        showToast("success", "Evento Actualizado", "Los cambios han sido guardados correctamente.");
      } else {
        // Modo Creación
        await api.createEvent(eventData);
        showToast("success", "Evento Creado", "El nuevo evento académico se ha registrado correctamente.");
      }
      setShowEventForm(false);
      setEditingEvent(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("danger", "Error", err.message || "Ocurrió un error al guardar el evento.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer y cancelará todas las inscripciones asociadas.")) {
      try {
        await api.deleteEvent(id);
        showToast("success", "Evento Eliminado", "El evento se ha eliminado del sistema.");
        loadData();
      } catch (err) {
        console.error(err);
        showToast("danger", "Error", err.message || "No se pudo eliminar el evento.");
      }
    }
  };

  // --- Operaciones de Participantes ---
  const handleSaveParticipant = async (participantData) => {
    try {
      await api.createParticipant(participantData);
      showToast("success", "Participante Registrado", "El participante ha sido registrado en el sistema universitario.");
      setShowParticipantForm(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("danger", "Error de Registro", err.message || "El correo o código ya se encuentran registrados.");
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este participante? Se cancelarán automáticamente todas sus inscripciones activas.")) {
      try {
        await api.deleteParticipant(id);
        showToast("success", "Participante Eliminado", "Se removió al participante y sus inscripciones del sistema.");
        loadData();
      } catch (err) {
        console.error(err);
        showToast("danger", "Error", err.message || "No se pudo eliminar al participante.");
      }
    }
  };

  // --- Manejadores de Inscripciones ---
  const handleInscribedSuccess = () => {
    showToast("success", "Inscripción Exitosa", "Se ha inscrito al participante en el evento.");
    setInscribingEvent(null);
    loadData();
  };

  const handleCancelInscriptionSuccess = () => {
    showToast("warning", "Inscripción Cancelada", "Se canceló la inscripción de forma correcta.");
    loadData();
  };

  // --- Filtrado en Memoria (Eventos) ---
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.expositor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lugar.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTipo = tipoFilter === "todos" || e.tipo === tipoFilter;
    
    return matchesSearch && matchesTipo;
  });

  // --- Filtrado en Memoria (Participantes) ---
  const filteredParticipants = participants.filter((p) => {
    return (
      p.nombre.toLowerCase().includes(participantSearchQuery.toLowerCase()) ||
      p.correo.toLowerCase().includes(participantSearchQuery.toLowerCase()) ||
      p.codigo.toLowerCase().includes(participantSearchQuery.toLowerCase())
    );
  });

  // --- Cálculos de Estadísticas ---
  const totalEventsCount = events.length;
  const totalParticipantsCount = participants.length;
  const totalInscriptionsCount = events.reduce((sum, e) => sum + (e.inscritos || 0), 0);

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        {/* Estadísticas superiores en modo Dashboard */}
        <Stats
          totalEvents={totalEventsCount}
          totalParticipants={totalParticipantsCount}
          totalInscriptions={totalInscriptionsCount}
        />

        {error && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            backgroundColor: "var(--danger-light)",
            border: "1px solid var(--danger)",
            color: "var(--danger)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2rem",
            fontWeight: 500
          }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Error de Conexión:</strong> {error}{" "}
              <button 
                onClick={loadData}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 600,
                  marginLeft: "0.5rem"
                }}
              >
                Reintentar Cargar
              </button>
            </div>
          </div>
        )}

        {/* VISTA DE EVENTOS */}
        {activeTab === "eventos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="action-bar">
              <div className="search-filter-group">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar evento por título, expositor, lugar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="select-filter"
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                >
                  <option value="todos">Todos los Tipos</option>
                  <option value="Conferencia">Conferencias</option>
                  <option value="Taller">Talleres</option>
                  <option value="Seminario">Seminarios</option>
                  <option value="Otro">Otros</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
              >
                <Plus size={18} />
                <span>Registrar Evento</span>
              </button>
            </div>

            {loading && events.length === 0 ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando eventos académicos universitarios...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <h3>No se encontraron eventos</h3>
                <p>
                  {searchQuery || tipoFilter !== "todos"
                    ? "Intenta cambiar los términos de búsqueda o filtros."
                    : "No hay eventos académicos registrados actualmente."}
                </p>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={(e) => {
                      setEditingEvent(e);
                      setShowEventForm(true);
                    }}
                    onDelete={handleDeleteEvent}
                    onInscribe={(e) => setInscribingEvent(e)}
                    onViewInscribed={(e) => setViewingInscribedEvent(e)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA DE PARTICIPANTES */}
        {activeTab === "participantes" && (
          <ParticipantList
            participants={filteredParticipants}
            searchQuery={participantSearchQuery}
            onSearchChange={setParticipantSearchQuery}
            onAddClick={() => setShowParticipantForm(true)}
            onDeleteParticipant={handleDeleteParticipant}
          />
        )}
      </main>

      {/* MODAL: FORMULARIO DE EVENTO (CREAR / EDITAR) */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* MODAL: REGISTRAR PARTICIPANTE */}
      {showParticipantForm && (
        <ParticipantForm
          onSave={handleSaveParticipant}
          onClose={() => setShowParticipantForm(false)}
        />
      )}

      {/* MODAL: REALIZAR INSCRIPCIÓN */}
      {inscribingEvent && (
        <InscribeModal
          event={inscribingEvent}
          allParticipants={participants}
          onClose={() => setInscribingEvent(null)}
          onInscribed={handleInscribedSuccess}
        />
      )}

      {/* MODAL: VER INSCRITOS Y CANCELAR */}
      {viewingInscribedEvent && (
        <ViewInscribedModal
          event={viewingInscribedEvent}
          onClose={() => setViewingInscribedEvent(null)}
          onCancelInscription={handleCancelInscriptionSuccess}
        />
      )}

      {/* TOAST NOTIFICATIONS */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`} role="alert">
            <div className="toast-icon">
              {toast.type === "success" && <CheckCircle2 size={20} />}
              {toast.type === "danger" && <AlertTriangle size={20} />}
              {toast.type === "warning" && <AlertCircle size={20} />}
            </div>
            <div className="toast-content">
              <h4 className="toast-title">{toast.title}</h4>
              <p className="toast-message">{toast.message}</p>
            </div>
            <button className="toast-close" onClick={() => setToast(null)} aria-label="Cerrar notificación">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
