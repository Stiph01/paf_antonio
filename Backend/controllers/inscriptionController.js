const Inscription = require("../models/inscriptionModel");

// Inscribir participante a un evento
exports.createInscription = (req, res) => {
  const { evento_id, participante_id } = req.body;

  if (!evento_id || !participante_id) {
    return res.status(400).json({ error: "Faltan datos requeridos (evento_id y participante_id)." });
  }

  Inscription.inscribe(evento_id, participante_id, (err) => {
    if (err) {
      console.error("Error al realizar inscripción:", err);
      if (err.code === "EVENT_NOT_FOUND") {
        return res.status(404).json({ error: err.message });
      }
      if (err.code === "CAPACITY_REACHED" || err.code === "ALREADY_INSCRIBED") {
        return res.status(409).json({ error: err.message });
      }
      return res.status(500).json({ error: "Error al procesar la inscripción." });
    }

    res.status(201).json({ mensaje: "Inscripción realizada correctamente." });
  });
};

// Cancelar una inscripción
exports.deleteInscription = (req, res) => {
  const { evento_id, participante_id } = req.params;

  if (!evento_id || !participante_id) {
    return res.status(400).json({ error: "Faltan parámetros requeridos en la ruta." });
  }

  Inscription.cancel(evento_id, participante_id, (err) => {
    if (err) {
      console.error("Error al cancelar inscripción:", err);
      return res.status(500).json({ error: "Error al cancelar la inscripción." });
    }
    res.json({ mensaje: "Inscripción cancelada correctamente." });
  });
};

// Obtener inscritos por evento
exports.getEventParticipants = (req, res) => {
  const { evento_id } = req.params;

  Inscription.getParticipantsByEvent(evento_id, (err, data) => {
    if (err) {
      console.error("Error al obtener inscritos del evento:", err);
      return res.status(500).json({ error: "Error al obtener inscritos del evento." });
    }
    res.json(data);
  });
};
