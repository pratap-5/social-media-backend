import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller.js";
import uploadProfile from "../middleware/uploadProfile.js";

const router = express.Router();

router.post("/signup", uploadProfile, signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
