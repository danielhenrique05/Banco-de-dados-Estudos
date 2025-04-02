
const { Router } = require("express")// importa o Router 

const NotesController = require("../controllers/NotesController") // importa o user controller

const notesRoutes = Router()

const notesController = new NotesController()

notesRoutes.post("/:user_id", notesController.create) 
notesRoutes.get("/:id", notesController.show) 
notesRoutes.delete("/:id", notesController.delete) 

module.exports = notesRoutes