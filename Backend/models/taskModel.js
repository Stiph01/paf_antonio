const db = require("./db");

// Obtener todas las tareas
exports.getAll = (callback) => {
  db.query("SELECT * FROM tareas", callback);
};

// Obtener tarea por ID
exports.getById = (id, callback) => {
  db.query("SELECT * FROM tareas WHERE id = ?", [id], callback);
};

// Crear tarea
exports.create = (task, callback) => {
  db.query("INSERT INTO tareas SET ?", task, callback);
};

// Actualizar tarea
exports.update = (id, task, callback) => {
  db.query("UPDATE tareas SET ? WHERE id = ?", [task, id], callback);
};

// Eliminar tarea
exports.delete = (id, callback) => {
  db.query("DELETE FROM tareas WHERE id = ?", [id], callback);
};

// Filtrar tareas
exports.filter = (campo, valor, callback) => {
  db.query(`SELECT * FROM tareas WHERE ${campo} = ?`, [valor], callback);
};
