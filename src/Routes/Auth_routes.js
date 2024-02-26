import express from "express";
import AuthController from "../Controllers/Auth_controller.js";
import { validateSignIn, validateSignUp } from "../Middlewares/Validation.js";

const authController = new AuthController();

// Initialize express Router instance
const authRouter = express.Router();

// Auth API Endpoints
authRouter.post("/register", validateSignUp, authController.register);
authRouter.post("/login", validateSignIn, authController.login);

export default authRouter;
