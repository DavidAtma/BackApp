
import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/login", authController.login);          // si ya lo tienes
router.post("/google", authController.googleSignIn);  // <--- así

export default router;
