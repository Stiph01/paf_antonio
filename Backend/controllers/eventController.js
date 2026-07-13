const Event = require("../models/eventModel");

// Obtener todos los eventos con búsqueda y filtros opcionales
exports.getEvents = (req, res) => {
  const { search, tipo } = req.query;
  const filters = { search, tipo };

  Event.getAll(filters, (err, data) => {
    if (err) {
      console.error("Error al obtener eventos:", err);
      return res.status(500).json({ error: "Error en la base de datos al listar eventos." });
    }
    res.json(data);
  });
};

// Obtener un evento específico por ID (incluye sus inscritos)
exports.getEvent = (req, res) => {
  Event.getById(req.params.id, (err, data) => {
    if (err) {
      console.error("Error al obtener evento:", err);
      return res.status(500).json({ error: "Error en la base de datos al obtener el evento." });
    }
    if (!data) {
      return res.status(404).json({ error: "El evento solicitado no existe." });
    }
    res.json(data);
  });
};

// Registrar un evento
exports.createEvent = (req, res) => {
  const { titulo, descripcion, tipo, fecha, hora, lugar, capacidad, expositor } = req.body;

  // Validación simple en el servidor
  if (!titulo || !tipo || !fecha || !hora || !lugar || !capacidad || !expositor) {
    return res.status(400).json({ error: "Faltan campos obligatorios para registrar el evento." });
  }

  const eventData = { titulo, descripcion, tipo, fecha, hora, lugar, capacidad, expositor };

  Event.create(eventData, (err, result) => {
    if (err) {
      console.error("Error al crear evento:", err);
      return res.status(500).json({ error: "Error en la base de datos al registrar el evento." });
    }
    res.status(201).json({
      mensaje: "Evento registrado correctamente.",
      id: result.insertId,
    });
  });
};

// Actualizar un evento
exports.updateEvent = (req, res) => {
  const { titulo, descripcion, tipo, fecha, hora, lugar, capacidad, expositor } = req.body;

  if (!titulo || !tipo || !fecha || !hora || !lugar || !capacidad || !expositor) {
    return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el evento." });
  }

  const eventData = { titulo, descripcion, tipo, fecha, hora, lugar, capacidad, expositor };

  Event.update(req.params.id, eventData, (err) => {
    if (err) {
      console.error("Error al actualizar evento:", err);
      return res.status(500).json({ error: "Error en la base de datos al actualizar el evento." });
    }
    res.json({ mensaje: "Evento actualizado correctamente." });
  });
};

// Eliminar un evento
exports.deleteEvent = (req, res) => {
  Event.delete(req.params.id, (err) => {
    if (err) {
      console.error("Error al eliminar evento:", err);
      return res.status(500).json({ error: "Error en la base de datos al eliminar el evento." });
    }
    res.json({ mensaje: "Evento eliminado correctamente." });
  });
};
