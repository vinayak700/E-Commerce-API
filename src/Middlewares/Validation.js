import { body, validationResult } from "express-validator";

const runValidationRules = async (req, res, next, rules) => {
  // Running the rules
  await Promise.all(rules.map((rule) => rule.run(req)));
  const validationErrors = validationResult(req);

  // Checking errors
  if (!validationErrors.isEmpty()) {
    // Returning errors if there are any
    return res.status(400).send(validationErrors.array()[0].msg);
  }
  next();
};

// Configuring data validation
export const validateSignUp = async (req, res, next) => {
  // Defining validation rules
  const rules = [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phoneNo")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Invalid phone number format")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digits long"),
  ];
  runValidationRules(req, res, next, rules);
};
export const validateSignIn = async (req, res, next) => {
  const rules = [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
  runValidationRules(req, res, next, rules);
};
export const validateProduct = async (req, res, next) => {
  const rules = [
    body("category_id")
      .notEmpty()
      .withMessage("Category ID is required")
      .isInt()
      .withMessage("Category ID must be an integer"),
    body("title").notEmpty().withMessage("Product title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number")
      .notEmpty()
      .withMessage("Price is required"),
    body("availability")
      .notEmpty()
      .withMessage("Availability is required")
      .isInt({ min: 1 })
      .withMessage("Availability must be a positive integer"),
  ];
  runValidationRules(req, res, next, rules);
};
