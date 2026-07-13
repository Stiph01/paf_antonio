const db = require("./db");

// Obtener todos los eventos con filtros de búsqueda y tipo
exports.getAll = (filters, callback) => {
  let query = `
    SELECT e.*, 
           (SELECT COUNT(*) FROM inscripciones WHERE evento_id = e.id) AS inscritos 
    FROM eventos e 
    WHERE 1=1
  `;
  const params = [];

  if (filters && filters.search) {
    query += " AND (e.titulo LIKE ? OR e.expositor LIKE ? OR e.lugar LIKE ?)";
    const searchVal = `%${filters.search}%`;
    params.push(searchVal, searchVal, searchVal);
  }

  if (filters && filters.tipo && filters.tipo !== "todos") {
    query += " AND e.tipo = ?";
    params.push(filters.tipo);
  }

  query += " ORDER BY e.fecha ASC, e.hora ASC";

  db.query(query, params, callback);
};

// Obtener un evento por ID junto con su lista de participantes inscritos
exports.getById = (id, callback) => {
  db.query("SELECT * FROM eventos WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);

    const event = results[0];

    // Obtener los participantes inscritos en este evento
    const qParticipants = `
      SELECT p.*, i.fecha_inscripcion 
      FROM participantes p
      INNER JOIN inscripciones i ON p.id = i.participante_id
      WHERE i.evento_id = ?
      ORDER BY i.fecha_inscripcion DESC
    `;

    db.query(qParticipants, [id], (err2, participants) => {
      if (err2) return callback(err2);
      event.participantes = participants;
      callback(null, event);
    });
  });
};

// Crear un nuevo evento
exports.create = (eventData, callback) => {
  db.query("INSERT INTO eventos SET ?", eventData, callback);
};

// Actualizar un evento existente
exports.update = (id, eventData, callback) => {
  db.query("UPDATE eventos SET ? WHERE id = ?", [eventData, id], callback);
};

// Eliminar un evento
exports.delete = (id, callback) => {
  db.query("DELETE FROM eventos WHERE id = ?", [id], callback);
};
