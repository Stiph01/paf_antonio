const API_BASE_URL = "http://localhost:3000/api";

const handleResponse = async (response) => {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.error || data?.mensaje || `Error del servidor: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Eventos
  getEvents: async (search = "", tipo = "todos") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (tipo && tipo !== "todos") params.append("tipo", tipo);
    
    const url = `${API_BASE_URL}/eventos?${params.toString()}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getEventById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`);
    return handleResponse(response);
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },

  // Participantes
  getParticipants: async (search = "") => {
    const url = search 
      ? `${API_BASE_URL}/participantes?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/participantes`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getParticipantById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/participantes/${id}`);
    return handleResponse(response);
  },

  createParticipant: async (participantData) => {
    const response = await fetch(`${API_BASE_URL}/participantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participantData),
    });
    return handleResponse(response);
  },

  deleteParticipant: async (id) => {
    const response = await fetch(`${API_BASE_URL}/participantes/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },

  // Inscripciones
  inscribe: async (evento_id, participante_id) => {
    const response = await fetch(`${API_BASE_URL}/inscripciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento_id, participante_id }),
    });
    return handleResponse(response);
  },

  cancelInscription: async (evento_id, participante_id) => {
    const response = await fetch(
      `${API_BASE_URL}/inscripciones/${evento_id}/${participante_id}`,
      { method: "DELETE" }
    );
    return handleResponse(response);
  },

  getEventParticipants: async (evento_id) => {
    const response = await fetch(`${API_BASE_URL}/inscripciones/evento/${evento_id}`);
    return handleResponse(response);
  }
};
