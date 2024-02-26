import { executeQuery } from "../../config/db.js";

export default class CartController {
  async addToCart(req, res, next) {
    const user_id = req.user.id;
    const { product_id } = req.params;
    const quantity = req.query.qty;

    try {
      // Check if the product is available
      const product = await executeQuery("SELECT * FROM Product WHERE id = ?", [
        product_id,
      ]);

      if (product.length === 0 || product[0].availability < quantity) {
        return res
          .status(400)
          .json({ msg: "Product is not available or sold out." });
      }

      // Check if the product already exists in the cart for the user
      const existingCartItem = await executeQuery(
        "SELECT * FROM Cart WHERE user_id = ? AND product_id = ?",
        [user_id, product_id]
      );

      // if (
      //   parseInt(quantity) + existingCartItem[0].quantity >
      //   product[0].availability
      // ) {
      //   return res.status(400).json({
      //     msg: "Quantity exceeds available stock for this product.",
      //   });
      // }

      if (existingCartItem.length > 0) {
        // Update the quantity of the existing cart item
        const updatedQuantity =
          existingCartItem[0].quantity + parseInt(quantity);
        await executeQuery(
          "UPDATE Cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [updatedQuantity, user_id, product_id]
        );
        return res.status(200).json({ msg: "Cart item quantity updated." });
      }

      // Add the product to the cart
      await executeQuery(
        "INSERT INTO Cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity]
      );
      return res.status(200).json({ msg: "Product added to cart." });
    } catch (error) {
      next();
    }
  }

  async removeFromCart(req, res, next) {
    const user_id = req.user.id;
    const { cart_id } = req.params;

    try {
      // Check if the cart item exists for the user
      const [existingCartItem] = await executeQuery(
        "SELECT * FROM Cart WHERE id = ? AND user_id = ?",
        [cart_id, user_id]
      );

      if (existingCartItem.length === 0) {
        return res
          .status(400)
          .json({ msg: "Cart item not found for the user." });
      }

      // Remove the cart item
      await executeQuery("DELETE FROM Cart WHERE id = ? AND user_id = ?", [
        cart_id,
        user_id,
      ]);
      return res.status(200).json({ msg: "Cart item removed successfully." });
    } catch (error) {
      next();
    }
  }

  async viewCartItems(req, res, next) {
    const user_id = req.user.id;

    try {
      // Get all cart items for the user
      const [cartItems] = await executeQuery(
        "SELECT * FROM Cart WHERE user_id = ?",
        [user_id]
      );
      return res.status(200).json({ cartItems });
    } catch (error) {
      next();
    }
  }

  async updateCartItemQty(req, res, next) {
    const user_id = req.user.id;
    const { cart_id } = req.params;
    const quantity = req.query.qty;

    try {
      // Check if the cart item exists for the user
      const [existingCartItem] = await executeQuery(
        "SELECT * FROM Cart WHERE id = ? AND user_id = ?",
        [cart_id, user_id]
      );

      if (!existingCartItem) {
        return res
          .status(404)
          .json({ msg: "Cart item not found for the user." });
      }

      const product = await executeQuery("SELECT * FROM Product WHERE id = ?", [
        existingCartItem.product_id,
      ]);

      if (!product || parseInt(quantity) > product[0].availability) {
        return res
          .status(400)
          .json({ msg: "Invalid quantity or product not available." });
      }

      // Update the quantity of the cart item
      await executeQuery(
        "UPDATE Cart SET quantity = ? WHERE id = ? AND user_id = ?",
        [quantity, cart_id, user_id]
      );
      return res.status(200).json({ msg: "Cart item quantity updated." });
    } catch (error) {
      next(error.message);
    }
  }
}
