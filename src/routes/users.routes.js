
const { Router } = require("express")// importa o Router 
const UsersController = require("../controllers/UsersController") // importa o user controller

const userRoutes = Router()
const UserController = new UsersController()

userRoutes.post("/", UserController.create) //direciona para criar o usuario

module.exports = userRoutes