import express from "express";
import ProductController from "../Controllers/Product_controller.js";
import { validateProduct } from "../Middlewares/Validation.js";

const productController = new ProductController();

// Initialize express Router instance
const productRouter = express.Router();

// Product API Endpoints
productRouter.get("/categories", productController.getCategoryListing);
productRouter.get(
  "/category/:category_id",
  productController.getProductListing
);
productRouter.get("/:product_id", productController.getProductDetails);

productRouter.post("/", validateProduct, productController.addProduct);
productRouter.delete("/:product_id", productController.removeProduct);

export default productRouter;
