import express from "express";
import { upload } from "../controllers/upload.controller.js";
import uploadFile from "../middleware/uploadFile.js";
import protectRoute from "../middleware/protectRoute.js";



const router = express.Router();

router.post("/upload_file" ,protectRoute ,uploadFile,upload)  ;//uploadFile is the multer middleware use to store the images and vedios 


export default router;
