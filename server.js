/* Module Imports */
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import morgan from "morgan";
import helmet from "helmet";
import swagger from "swagger-ui-express";

/* File Imports */
import { errorHandler } from "./src/Middlewares/Error_Handler.js";
import authRouter from "./src/Routes/Auth_routes.js";
import productRouter from "./src/Routes/Product_routes.js";
import { verifyToken } from "./src/Middlewares/Auth.js";
import cartRouter from "./src/Routes/Cart_routes.js";
import orderRouter from "./src/Routes/Order_routes.js";
import connectToDb, { executeQuery } from "./config/db.js";
import apiDocs from "./swagger.json" assert { type: "json" };

// Initialize express application
const app = express();

/* CONFIGURATIONS */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(
  cors({
    origin: "*",
    methods: "*",
    credentials: true,
  })
);
app.use(express.json());

/* SETTING UP LOCAL ROUTES */
app.use(express.static("public"));

/* API DOCUMENTATION */
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

/* WELCOME PAGE */
app.get("/", (req, res) => {
  res.status(200).redirect("./welcome.html");
});

/* RATE LIMITER */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

/* API ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/products", verifyToken, productRouter);
app.use("/api/cart", verifyToken, cartRouter);
app.use("/api/orders", verifyToken, orderRouter);

app.use(errorHandler);

// Listening for Server
app.listen(8080, () => {
  connectToDb();
  console.log("Server is runing on http://localhost:8080");
});
