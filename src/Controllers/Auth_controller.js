import { executeQuery } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class AuthController {
  async register(req, res, next) {
    const { first_name, last_name, email, password, address, phoneNo } =
      req.body;

    // Email Validation
    const user = await executeQuery("SELECT * FROM User WHERE email = ?", [
      email,
    ]);
    if (user.length > 0) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      // Insert new user into the database
      const query =
        "INSERT INTO User (first_name, last_name, email, password, address, phoneNo) VALUES (?, ?, ?, ?, ?, ?)";
      const placeholders = [
        first_name,
        last_name,
        email,
        passwordHash,
        address,
        phoneNo,
      ];

      // Check if any placeholders are undefined
      if (placeholders.some((value) => value === undefined)) {
        return res
          .status(400)
          .json({ msg: "Some required fields are undefined." });
      }

      const result = await executeQuery(query, placeholders);
      const newUser = {
        id: result.insertId,
        first_name,
        last_name,
        email,
        address,
        phoneNo,
      };
      res.status(201).json(newUser);
    } catch (error) {
      next(error.message);
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      // Find user by email
      const query = "SELECT * FROM User WHERE email = ?";
      const placeholders = [email];
      const user = await executeQuery(query, placeholders);

      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      // Generate JWT token
      const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET_KEY);

      // Remove sensitive data from user object
      delete user[0].password;
      res.status(200).json({ token, user: user[0] });
    } catch (error) {
      next(error.message);
    }
  }
}
