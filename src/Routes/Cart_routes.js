import express from "express";
import CartController from "../Controllers/Cart_Controller.js";

const cartController = new CartController();

// Initialize express Router instance
const cartRouter = express.Router();

// Auth API Endpoints
cartRouter.post("/:product_id", cartController.addToCart);
cartRouter.delete("/:cart_id", cartController.removeFromCart);
cartRouter.get("/", cartController.viewCartItems);
cartRouter.put("/:cart_id", cartController.updateCartItemQty);

export default cartRouter;
