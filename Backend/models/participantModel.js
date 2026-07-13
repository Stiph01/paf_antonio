const db = require("./db");

// Obtener todos los participantes, opcionalmente filtrados por búsqueda (nombre, correo o código)
exports.getAll = (search, callback) => {
  let query = `
    SELECT p.*, 
           (SELECT COUNT(*) FROM inscripciones WHERE participante_id = p.id) AS total_eventos 
    FROM participantes p
  `;
  const params = [];

  if (search) {
    query += " WHERE p.nombre LIKE ? OR p.correo LIKE ? OR p.codigo LIKE ?";
    const searchVal = `%${search}%`;
    params.push(searchVal, searchVal, searchVal);
  }

  query += " ORDER BY p.nombre ASC";

  db.query(query, params, callback);
};

// Obtener un participante por ID con la lista de eventos en los que está inscrito
exports.getById = (id, callback) => {
  db.query("SELECT * FROM participantes WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);

    const participant = results[0];

    const qEvents = `
      SELECT e.*, i.fecha_inscripcion 
      FROM eventos e
      INNER JOIN inscripciones i ON e.id = i.evento_id
      WHERE i.participante_id = ?
      ORDER BY e.fecha ASC
    `;

    db.query(qEvents, [id], (err2, events) => {
      if (err2) return callback(err2);
      participant.eventos = events;
      callback(null, participant);
    });
  });
};

// Crear participante
exports.create = (participantData, callback) => {
  db.query("INSERT INTO participantes SET ?", participantData, callback);
};

// Actualizar participante
exports.update = (id, participantData, callback) => {
  db.query("UPDATE participantes SET ? WHERE id = ?", [participantData, id], callback);
};

// Eliminar participante
exports.delete = (id, callback) => {
  db.query("DELETE FROM participantes WHERE id = ?", [id], callback);
};
