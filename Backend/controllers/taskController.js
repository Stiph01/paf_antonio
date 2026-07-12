const Task = require("../models/taskModel");

// Obtener todas
exports.getTasks = (req, res) => {
  const { usuario, estado, prioridad } = req.query;

  if (usuario) {
    return Task.filter("usuario_asignado", usuario, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  }

  if (estado) {
    return Task.filter("estado", estado, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  }

  if (prioridad) {
    return Task.filter("prioridad", prioridad, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  }

  Task.getAll((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

// Obtener por ID
exports.getTask = (req, res) => {
  Task.getById(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

// Crear
exports.createTask = (req, res) => {
  Task.create(req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensaje: "Tarea registrada correctamente",
    });
  });
};

// Actualizar
exports.updateTask = (req, res) => {
  Task.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensaje: "Tarea actualizada correctamente",
    });
  });
};

// Eliminar
exports.deleteTask = (req, res) => {
  Task.delete(req.params.id, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      mensaje: "Tarea eliminada correctamente",
    });
  });
};
