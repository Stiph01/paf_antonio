const Participant = require("../models/participantModel");

// Obtener todos los participantes con búsqueda opcional
exports.getParticipants = (req, res) => {
  const { search } = req.query;

  Participant.getAll(search, (err, data) => {
    if (err) {
      console.error("Error al obtener participantes:", err);
      return res.status(500).json({ error: "Error al listar participantes." });
    }
    res.json(data);
  });
};

// Obtener un participante específico con su historial de eventos inscritos
exports.getParticipant = (req, res) => {
  Participant.getById(req.params.id, (err, data) => {
    if (err) {
      console.error("Error al obtener participante:", err);
      return res.status(500).json({ error: "Error al obtener detalles del participante." });
    }
    if (!data) {
      return res.status(404).json({ error: "El participante no existe." });
    }
    res.json(data);
  });
};

// Crear participante
exports.createParticipant = (req, res) => {
  const { nombre, correo, rol, codigo } = req.body;

  // Validación básica
  if (!nombre || !correo || !rol || !codigo) {
    return res.status(400).json({ error: "Faltan campos obligatorios para registrar al participante." });
  }

  const participantData = { nombre, correo, rol, codigo };

  Participant.create(participantData, (err, result) => {
    if (err) {
      console.error("Error al crear participante:", err);
      // Capturar duplicados de correo o código (Unique keys)
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El correo electrónico o código ya se encuentran registrados." });
      }
      return res.status(500).json({ error: "Error al registrar al participante." });
    }
    res.status(201).json({
      mensaje: "Participante registrado correctamente.",
      id: result.insertId,
    });
  });
};

// Actualizar participante
exports.updateParticipant = (req, res) => {
  const { nombre, correo, rol, codigo } = req.body;

  if (!nombre || !correo || !rol || !codigo) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const participantData = { nombre, correo, rol, codigo };

  Participant.update(req.params.id, participantData, (err) => {
    if (err) {
      console.error("Error al actualizar participante:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El correo electrónico o código ya están en uso por otro participante." });
      }
      return res.status(500).json({ error: "Error al actualizar participante." });
    }
    res.json({ mensaje: "Participante actualizado correctamente." });
  });
};

// Eliminar participante
exports.deleteParticipant = (req, res) => {
  Participant.delete(req.params.id, (err) => {
    if (err) {
      console.error("Error al eliminar participante:", err);
      return res.status(500).json({ error: "Error al eliminar participante." });
    }
    res.json({ mensaje: "Participante eliminado correctamente." });
  });
};
