const express = require('express')

const router = express.Router()

//GET ==> get all Categories
router.get('/all',(request,response)=>{
    response.status(200).json({massage:'all categories will back soon '})
})


module.exports = router