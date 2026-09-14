const authMiddleware = require("./middleware/authMiddleware");
const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

app.get("/", (req, res) => {
  res.json({
    message: "GreenHive Cyber & Gas API is running",
  });
});
app.get("/api/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM service_requests WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve request",
    });
  }
});
app.get("/api/requests", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM service_requests ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve requests",
    });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const { name, phone, service, message } = req.body;

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

    res.status(201).json({
      message: "Request submitted successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save request",
    });
  }
});
app.patch("/api/requests/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

    res.json({
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update request status",
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GreenHive API running on http://localhost:${PORT}`);
});