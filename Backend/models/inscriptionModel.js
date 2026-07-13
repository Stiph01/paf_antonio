const db = require("./db");

// Inscribir a un participante en un evento
exports.inscribe = (evento_id, participante_id, callback) => {
  // 1. Obtener la capacidad del evento y la cantidad actual de inscritos
  const qCheck = `
    SELECT 
      (SELECT capacidad FROM eventos WHERE id = ?) AS capacidad,
      (SELECT COUNT(*) FROM inscripciones WHERE evento_id = ?) AS inscritos
  `;

  db.query(qCheck, [evento_id, evento_id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0 || results[0].capacidad === null) {
      const errNotExist = new Error("El evento especificado no existe.");
      errNotExist.code = "EVENT_NOT_FOUND";
      return callback(errNotExist);
    }

    const { capacidad, inscritos } = results[0];

    // Verificar si ya se alcanzó el límite de aforo
    if (inscritos >= capacidad) {
      const errCapacity = new Error("La capacidad máxima del evento ha sido alcanzada.");
      errCapacity.code = "CAPACITY_REACHED";
      return callback(errCapacity);
    }

    // 2. Insertar la inscripción
    db.query(
      "INSERT INTO inscripciones (evento_id, participante_id) VALUES (?, ?)",
      [evento_id, participante_id],
      (errInsert, res) => {
        if (errInsert) {
          // Capturar error de duplicado (Unique constraint)
          if (errInsert.code === "ER_DUP_ENTRY") {
            const errDup = new Error("El participante ya está inscrito en este evento.");
            errDup.code = "ALREADY_INSCRIBED";
            return callback(errDup);
          }
          return callback(errInsert);
        }
        callback(null, res);
      }
    );
  });
};

// Cancelar una inscripción
exports.cancel = (evento_id, participante_id, callback) => {
  db.query(
    "DELETE FROM inscripciones WHERE evento_id = ? AND participante_id = ?",
    [evento_id, participante_id],
    callback
  );
};

// Obtener los participantes inscritos en un evento
exports.getParticipantsByEvent = (evento_id, callback) => {
  const query = `
    SELECT p.*, i.fecha_inscripcion 
    FROM participantes p
    INNER JOIN inscripciones i ON p.id = i.participante_id
    WHERE i.evento_id = ?
    ORDER BY i.fecha_inscripcion DESC
  `;
  db.query(query, [evento_id], callback);
};
