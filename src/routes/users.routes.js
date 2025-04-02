
const { Router } = require("express")// importa o Router 
const UsersController = require("../controllers/UsersController") // importa o user controller

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.post("/", usersController.create) //direciona para criar o usuario
userRoutes.put("/:id", usersController.update)

module.exports = userRoutes