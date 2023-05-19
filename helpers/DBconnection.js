import mongoose from 'mongoose'

export const  init = async (app) => {
    try {
        const CONNECTION = await mongoose.connect(process.env.DB_CONNECTION)

        if(CONNECTION){
            console.log("DB CONNECTED")
            app.listen(process.env.PORT,()=>{
                console.log('APP IS WORKING')
            })
        }
    } catch (error) {
        console.log("FAILD TO CONNECT")
    }
}