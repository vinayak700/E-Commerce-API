import { executeQuery } from "../../config/db.js";

export default class OrderController {
  /* reating an User Order */
  // async placeOrder(req, res, next) {
  //   const user_id = req.user.id;
  //   try {
  //     const cartItems = await executeQuery(
  //       "SELECT * FROM Cart WHERE user_id = ?",
  //       [user_id]
  //     );
  //     if (cartItems.length === 0) {
  //       return res
  //         .status(400)
  //         .json({ msg: "No Items are present in the Cart." });
  //     }
  //     // Calculate total price of the order
  //     let totalPrice = 0;
  //     for (const cartItem of cartItems) {
  //       const product = await executeQuery(
  //         "SELECT * FROM Product WHERE id = ?",
  //         [cartItem.product_id]
  //       );
  //       totalPrice +=
  //         parseFloat(cartItem.quantity) * parseFloat(product[0].price);
  //     }

  //     try {
  //       // Insert order into the database
  //       const { insertId } = await executeQuery(
  //         "INSERT INTO `Order` (user_id, quantity, total_price, status) VALUES (?, ?, ?, ?)",
  //         [user_id, cartItems.length, totalPrice, "Pending"]
  //       );

  //       // Update order ID for each cart item and decrease product quantity
  //       for (const cartItem of cartItems) {
  //         const product = await executeQuery(
  //           "SELECT * FROM Product WHERE id = ?",
  //           [cartItem.product_id]
  //         );
  //         const newQty = product[0].availability - cartItem.quantity;
  //         await executeQuery(
  //           "UPDATE Product SET availability = ? WHERE id = ?",
  //           [newQty, cartItem.product_id]
  //         );

  //         await executeQuery("UPDATE Cart SET order_id = ? WHERE id = ?", [
  //           insertId,
  //           cartItem.id,
  //         ]);
  //       }
  //       // Clear user's cart
  //       await executeQuery("DELETE FROM Cart WHERE user_id = ?", [user_id]);
  //       await executeQuery("COMMIT");
  //       return res.status(201).json({ msg: "Order placed successfully." });
  //     } catch (error) {
  //       // Rollback the transaction if an error occurs
  //       await executeQuery("ROLLBACK");
  //       throw error;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }

  async placeOrder(req, res, next) {
    const user_id = req.user.id;
    try {
      // Retrieve cart items for the user
      const cartItems = await executeQuery(
        "SELECT c.id AS cart_id, c.product_id, c.quantity, p.price, p.availability FROM Cart c INNER JOIN Product p ON c.product_id = p.id WHERE c.user_id = ?",
        [user_id]
      );

      if (cartItems.length === 0) {
        return res
          .status(400)
          .json({ msg: "No items are present in the cart." });
      }

      // Calculate total price of the order and update product availability
      let totalPrice = 0;
      const updates = [];
      for (const cartItem of cartItems) {
        totalPrice +=
          parseFloat(cartItem.quantity) * parseFloat(cartItem.price);
        const newAvailability = cartItem.availability - cartItem.quantity;
        updates.push(
          executeQuery("UPDATE Product SET availability = ? WHERE id = ?", [
            newAvailability,
            cartItem.product_id,
          ])
        );
      }

      // Execute all product availability updates concurrently
      await Promise.all(updates);

      // Insert order into the database
      const { insertId } = await executeQuery(
        "INSERT INTO `Order` (user_id, quantity, total_price, status) VALUES (?, ?, ?, ?)",
        [user_id, cartItems.length, totalPrice, "Pending"]
      );

      // Clear user's cart
      await executeQuery("DELETE FROM Cart WHERE user_id = ?", [user_id]);
      return res.status(201).json({ msg: "Order placed successfully." });
    } catch (error) {
      next(error.message);
    }
  }

  /* Getting Order History for a User*/
  async getOrderHistory(req, res, next) {
    const userId = req.user.id;
    try {
      // Fetch order history for the user
      const orders = await executeQuery(
        "SELECT * FROM `Order` WHERE user_id = ?",
        [userId]
      );
      return res.status(200).json({ orders });
    } catch (error) {
      next(error.message);
    }
  }

  /* Getting a Specific Order details for a User */
  async getOrderDetails(req, res, next) {
    const userId = req.user.id;
    const { orderId } = req.params;

    try {
      // Fetch detailed information of a specific order by its ID and user ID
      const [order] = await executeQuery(
        "SELECT * FROM `Order` WHERE id = ? AND user_id = ?",
        [orderId, userId]
      );
      if (!order) {
        return res.status(404).json({ msg: "Order not found for the user." });
      }
      return res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }
}
