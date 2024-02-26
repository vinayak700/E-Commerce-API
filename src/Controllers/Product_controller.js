import { executeQuery } from "../../config/db.js";

export default class ProductController {

  // INSERT INTO `category` (`id`, `value`) VALUES (NULL, 'Category_name'); (Use this query command to add multiple categories)

  /* Fetching all the categories */
  async getCategoryListing(req, res, next) {
    try {
      // Retrieve a list of categories
      const categories = await executeQuery("SELECT * FROM Category");
      return res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }

  // Getting all Products based on the category id
  async getProductListing(req, res, next) {
    const { category_id } = req.params;

    try {
      // Retrieve a list of products based on category ID
      const products = await executeQuery(
        "SELECT id, title, price, description, availability FROM Product WHERE category_id = ?",
        [category_id]
      );
      return res.status(200).json({ products });
    } catch (error) {
      next(error);
    }
  }

  /* Fetching Product details based on the product id */
  async getProductDetails(req, res, next) {
    const { product_id } = req.params;

    try {
      // Fetch detailed information of a specific product by its ID
      const [product] = await executeQuery(
        "SELECT * FROM Product WHERE id = ?",
        [product_id]
      );
      if (!product) {
        return res.status(404).json({ msg: "Product not found." });
      }
      return res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }

  /* Adding a new Product */
  async addProduct(req, res, next) {
    const { category_id, title, description, price, availability } = req.body;

    try {
      // Validate input data
      if (!category_id || !title || !price || !availability) {
        return res
          .status(400)
          .json({ msg: "Please provide all required fields." });
      }

      // Insert new product into the database
      const query =
        "INSERT INTO Product (category_id, title, description, price, availability) VALUES (?, ?, ?, ?, ?)";
      const placeholders = [
        category_id,
        title,
        description,
        price,
        availability,
      ];
      await executeQuery(query, placeholders);
      return res.status(201).json({ msg: "Product added successfully." });
    } catch (error) {
      next(error);
    }
  }

  /* Removing a product with a product_id */
  async removeProduct(req, res, next) {
    const { product_id } = req.params;

    try {
      // Check if the product exists
      const [product] = await executeQuery(
        "SELECT * FROM Product WHERE id = ?",
        [product_id]
      );
      if (!product) {
        return res.status(404).json({ msg: "Product not found." });
      }

      // Remove the product from the database
      await executeQuery("DELETE FROM Product WHERE id = ?", [product_id]);
      return res.status(200).json({ msg: "Product removed successfully." });
    } catch (error) {
      next(error);
    }
  }
}
