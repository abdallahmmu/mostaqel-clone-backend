const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

//INIT APP
const {init} = require('./helpers/DBconnection')

//ROUTES IMPORT
const categoryRoute = require('./routes/categoryRoute')


//APP MiddleWares
app.use(cors())
app.use(express.json())

//MiddleWares Routes
app.use('/api/v1/category',categoryRoute)

//Catch All Routes
app.get("*",(request,response)=>{
    response.status(200).json({error:'This Route Is Not Correct'})
})

//ERROR HANDLING
app.use((error,request,response,next)=>{
    

    response.status(error.statusCode).json({error:error.message})

})


init(app)
