import express from "express";
import OrderController from "../Controllers/Order_controller.js";

const orderController = new OrderController();

// Initialize express Router instance
const orderRouter = express.Router();

// Auth API Endpoints
orderRouter.post("/place-order", orderController.placeOrder);
orderRouter.get("/:orderId", orderController.getOrderDetails);
orderRouter.get("/", orderController.getOrderHistory);

export default orderRouter;
