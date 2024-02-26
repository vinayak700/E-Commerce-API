# Project Name

Welcome to the Project Name project! This project is a [brief description of the project].

## Table of Contents

- [Project Description](#project-description)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Tech Stack](#tech-stack)

## Project Description

Project Name is a [brief description of the project]. It provides users with [key features or functionality].

## Installation

To get started with Project Name, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd project-directory
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and provide the necessary configuration.

5. Set up the database:

   Create a new database and configure the connection in the `.env` file by replacing the username and password.

## Usage

To start the server locally, run the following command:

```bash
npm run start
```

## Endpoints

### Authentication

- **POST /api/auth/register**

  - Description: Register a new user
  - Request Body:
    - `first_name`: string (required)
    - `last_name`: string (required)
    - `email`: string (required, unique)
    - `password`: string (required)
    - `address`: string (optional)
    - `phoneNo`: string (optional)
  - Response: User object

- **POST /api/auth/login**
  - Description: Log in with existing credentials
  - Request Body:
    - `email`: string (required)
    - `password`: string (required)
  - Response: JWT token

### Products

- **GET /api/products**

  - Description: Get all products
  - Response: Array of product objects

- **GET /api/products/:id**

  - Description: Get a specific product by ID
  - Response: Product object

- **POST /api/products**
  - Description: Create a new product
  - Request Body:
    - `name`: string (required)
    - `price`: number (required)
    - `description`: string (optional)
    - `category`: string (required)
  - Response: Created product object

### Cart

- **POST /api/cart/add/:product_id**

  - Description: Add a product to the user's cart
  - Request Query:
    - `qty`: number (required)
  - Response: Success message

- **GET /api/cart**

  - Description: Get all items in the user's cart
  - Response: Array of cart item objects

- **PUT /api/cart/:cart_id**
  - Description: Update quantity of a cart item
  - Request Query:
    - `qty`: number (required)
  - Response: Success message

### Orders

- **POST /api/orders**

  - Description: Place a new order
  - Response: Success message

- **GET /api/orders/history**
  - Description: Get order history for the user
  - Response: Array of order objects

## Tech Stack

- **Backend Framework/Language:** Node.js with Express.js
- **Database Management System:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **API Rate Limiting:** express-rate-limiter
- **Request Validation:** express-validator
- **Security:** Helmet
- **Logging:** Morgan
- **Database Connector:** mysql2
- **API Documentation:** Swagger UI Express
- **Cross-Origin Resource Sharing (CORS):** cors
- **Environment Variables:** dotenv

```

```
