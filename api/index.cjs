const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = async (req, res) => {
  try {
    const method = req.method;
    const path = req.url.split("?")[0];

    // ADMIN LOGIN
    if (method === "POST" && path === "/api/admin/login") {
      const { username, password } = req.body || {};

      if (!username || !password) {
        return res.status(400).json({
          message: "Username and password are required",
        });
      }

      const [rows] = await pool.execute(
        "SELECT * FROM admins WHERE username = ?",
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const admin = rows[0];

      const passwordMatches = await bcrypt.compare(
        password,
        admin.password_hash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        {
          adminId: admin.id,
          username: admin.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      });
    }

    return res.status(404).json({
      message: "API endpoint not found",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};