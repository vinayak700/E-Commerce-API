const queryToCreateUser = `
  CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phoneNo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const queryToCreateProduct = `
  CREATE TABLE Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// /
const queryToCreateCart = `
   CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT UNIQUE NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (product_id) REFERENCES Product(id)
    )`;

// /place-order
const queryToCreateOrder = `
    CREATE TABLE \`Order\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status ENUM('Completed', 'Rejected', 'Pending') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(id)
    )
`;

export {
  queryToCreateCart,
  queryToCreateOrder,
  queryToCreateProduct,
  queryToCreateUser,
};

/* Run this Queries to Create tables from server.js */

// One time request
// app.get("/api/createUserTable", async (req, res) => {
//   try {
//     const query = queryToCreateUser;
//     const placeholders = [];
//     await executeQuery(query, placeholders);
//     console.log("User Table Created Successfully!!");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// app.get("/api/createProductTable", async (req, res) => {
//   try {
//     const query = queryToCreateProduct;
//     const placeholders = [];
//     await executeQuery(query, placeholders);
//     console.log("Product Table Created Successfully!!");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// app.get("/api/createCartTable", async (req, res) => {
//   try {
//     const query = queryToCreateCart;
//     const placeholders = [];
//     await executeQuery(query, placeholders);
//     console.log("Cart Table Created Successfully!!");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
// app.get("/api/createOrderTable", async (req, res) => {
//   try {
//     const query = queryToCreateOrder;
//     const placeholders = [];
//     await executeQuery(query, placeholders);
//     console.log("Order Table Created Successfully!!");
//   } catch (error) {
//     console.log(error.message);
//   }
// });
