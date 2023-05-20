import fs from 'fs'
export const deleteFile = (filePath) => {

    fs.unlink(filePath,(error)=>{
        if(error){
            error.message = 'deleted file faild'
            error.statusCode = 500

            throw error
        }
    })
}