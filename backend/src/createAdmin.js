const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

async function createAdmin() {
  const username = "admin";

  const password = "GreenHiveAdmin123!";

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.execute(
    "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
    [username, passwordHash]
  );

  console.log("Admin account created successfully.");
  console.log("Username:", username);
  console.log("Password:", password);

  await pool.end();
}

createAdmin().catch((error) => {
  console.error(error);
});