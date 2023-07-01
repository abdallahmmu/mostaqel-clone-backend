import  express  from "express";
import { loginAdmin } from "../controllers/adminController.js";

export const adminRoute = express.Router()


adminRoute.post('/',loginAdmin)
adminRoute.delete('/delete-freelancer',loginAdmin)


