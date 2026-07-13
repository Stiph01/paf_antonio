const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/inscriptionController");

router.post("/", inscriptionController.createInscription);
router.delete("/:evento_id/:participante_id", inscriptionController.deleteInscription);
router.get("/evento/:evento_id", inscriptionController.getEventParticipants);

module.exports = router;
