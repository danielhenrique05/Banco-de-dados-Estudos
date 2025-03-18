const express = require("express")
require('express-async-errors')

const migrationsRun = require("./database/sqlite/migrations")

const routes = require ('./routes') 
migrationsRun()


const AppError = require('./utils/AppError') 

const app = express()
app.use(express.json())
app.use(routes) 

app.use((error, request, response, next) => {
  
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      error: "error",
      message: error.message
    })
  }

  return response.status(500).json({
    message: "Internal server error",
    status: "error"
  })
})

const PORT = process.env.PORT || 4444
app.listen(PORT , ()=> console.log(`Server is running on port ${PORT}`))
