const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const eventRoutes = require("./routes/eventRoutes");
const participantRoutes = require("./routes/participantRoutes");
const inscriptionRoutes = require("./routes/inscriptionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", taskRoutes);
app.use("/api/eventos", eventRoutes);
app.use("/api/participantes", participantRoutes);
app.use("/api/inscripciones", inscriptionRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Gestión de Eventos Universitarios funcionando correctamente",
  });
});

module.exports = app;
