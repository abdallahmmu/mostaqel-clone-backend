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


//MiddleWares Routes
app.use('/api/v1/category',categoryRoute)



init(app)
