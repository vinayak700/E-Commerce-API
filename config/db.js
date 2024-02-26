import mysql from "mysql2/promise";

let isConnected = {
  ecomdb: null,
};

const connectToDb = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: "root",
      password: "",
      database: process.env.MYSQL_DBNAME,
    });
    isConnected["ecomdb"] = connection;
    console.log("Database connection established");
  } catch (error) {
    next();
  }
};

export const executeQuery = async (
  query,
  placeholders,
  dbname = process.env.MYSQL_DBNAME
) => {
  if (!isConnected[dbname]) {
    await connectToDb();
  }
  const [results, fields] = await isConnected[dbname].execute(
    query,
    placeholders
  );
  return results;
};

export default connectToDb;

// eg to make database queries
// db.executeQuery("select * from order where id=?", [1]);
// db.executeQuery("create table ", []);
