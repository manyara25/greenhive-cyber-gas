const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    const path = event.path.replace(/^\/\.netlify\/functions\/api/, "");

    // ADMIN LOGIN
    if (method === "POST" && path === "/admin/login") {
      const { username, password } = JSON.parse(event.body || "{}");

      if (!username || !password) {
        return response(400, {
          message: "Username and password are required",
        });
      }

      const [rows] = await pool.execute(
        "SELECT * FROM admins WHERE username = ?",
        [username]
      );

      if (rows.length === 0) {
        return response(401, {
          message: "Invalid username or password",
        });
      }

      const admin = rows[0];

      const passwordMatches = await bcrypt.compare(
        password,
        admin.password_hash
      );

      if (!passwordMatches) {
        return response(401, {
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

      return response(200, {
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      });
    }

    // SUBMIT SERVICE REQUEST
    if (method === "POST" && path === "/requests") {
      const { name, phone, service, message } = JSON.parse(
        event.body || "{}"
      );

      if (!name || !phone || !service) {
        return response(400, {
          message: "Name, phone and service are required",
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO service_requests
        (name, phone, service, message)
        VALUES (?, ?, ?, ?)`,
        [name, phone, service, message || null]
      );

      return response(201, {
        message: "Request submitted successfully",
        id: result.insertId,
      });
    }

    // GET REQUEST BY ID
    if (method === "GET" && path.startsWith("/requests/")) {
      const id = path.split("/")[2];

      const [rows] = await pool.execute(
        "SELECT * FROM service_requests WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return response(404, {
          message: "Request not found",
        });
      }

      return response(200, rows[0]);
    }

    // ADMIN REQUEST LIST
    if (method === "GET" && path === "/requests") {
      const admin = authenticate(event);

      if (!admin) {
        return response(401, {
          message: "Access denied. No valid token provided.",
        });
      }

      const [rows] = await pool.query(
        "SELECT * FROM service_requests ORDER BY created_at DESC"
      );

      return response(200, rows);
    }

    // ADMIN UPDATE REQUEST STATUS
    if (method === "PATCH" && path.startsWith("/requests/")) {
      const admin = authenticate(event);

      if (!admin) {
        return response(401, {
          message: "Access denied. No valid token provided.",
        });
      }

      const id = path.split("/")[2];
      const { status } = JSON.parse(event.body || "{}");

      const allowedStatuses = [
        "New",
        "In Progress",
        "Completed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return response(400, {
          message: "Invalid status",
        });
      }

      const [result] = await pool.execute(
        "UPDATE service_requests SET status = ? WHERE id = ?",
        [status, id]
      );

      if (result.affectedRows === 0) {
        return response(404, {
          message: "Request not found",
        });
      }

      return response(200, {
        message: "Request status updated successfully",
      });
    }

    return response(404, {
      message: "API endpoint not found",
    });
  } catch (error) {
    console.error(error);

    return response(500, {
      message: "Server error",
    });
  }
};

function authenticate(event) {
  try {
    const authHeader =
      event.headers.authorization ||
      event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}