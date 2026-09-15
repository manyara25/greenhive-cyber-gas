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

function authenticate(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  try {
    const method = req.method;
    const path = req.url.split("?")[0];

    // =========================
    // ADMIN LOGIN
    // =========================
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

      return res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      });
    }

    // =========================
    // CREATE CUSTOMER REQUEST
    // =========================
    if (method === "POST" && path === "/api/requests") {
      const { name, phone, service, message } = req.body || {};

      if (!name || !phone || !service) {
        return res.status(400).json({
          message: "Name, phone and service are required",
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO service_requests
        (name, phone, service, message)
        VALUES (?, ?, ?, ?)`,
        [name, phone, service, message || null]
      );

      return res.status(201).json({
        message: "Request submitted successfully",
        id: result.insertId,
      });
    }

    // =========================
    // CUSTOMER TRACKS REQUEST
    // =========================
    if (
      method === "GET" &&
      /^\/api\/requests\/\d+$/.test(path)
    ) {
      const id = path.split("/").pop();

      const [rows] = await pool.execute(
        "SELECT * FROM service_requests WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      return res.json(rows[0]);
    }

    // =========================
    // ADMIN GET ALL REQUESTS
    // =========================
    if (method === "GET" && path === "/api/requests") {
      const admin = authenticate(req);

      if (!admin) {
        return res.status(401).json({
          message: "Invalid or missing token",
        });
      }

      const [rows] = await pool.query(
        "SELECT * FROM service_requests ORDER BY created_at DESC"
      );

      return res.json(rows);
    }

    // =========================
    // ADMIN UPDATE REQUEST
    // =========================
    if (
      method === "PATCH" &&
      /^\/api\/requests\/\d+$/.test(path)
    ) {
      const admin = authenticate(req);

      if (!admin) {
        return res.status(401).json({
          message: "Invalid or missing token",
        });
      }

      const id = path.split("/").pop();
      const { status } = req.body || {};

      const allowedStatuses = [
        "New",
        "In Progress",
        "Completed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const [result] = await pool.execute(
        "UPDATE service_requests SET status = ? WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      return res.json({
        message: "Request status updated successfully",
      });
    }

    return res.status(404).json({
      message: "API endpoint not found",
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};