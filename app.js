const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
//ROUTES
const categoryRoute = require('./routes/categoryRoute')

//MiddleWares Routes
app.use('/api/v1/category',categoryRoute)


app.listen(process.env.PORT,()=>{
    console.log('APP IS WORKING')
})