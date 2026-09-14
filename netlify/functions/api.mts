import type { Config } from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { admins, serviceRequests } from "../../db/schema.js";

const allowedStatuses = ["New", "In Progress", "Completed", "Cancelled"];

type TokenPayload = { adminId: number; username: string };
type ServiceRequest = typeof serviceRequests.$inferSelect;

const serializeRequest = (request: ServiceRequest) => ({
  id: request.id,
  name: request.name,
  phone: request.phone,
  service: request.service,
  message: request.message,
  status: request.status,
  created_at: request.createdAt,
});

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const authenticate = (req: Request): TokenPayload | null => {
  const authorization = req.headers.get("authorization");
  const secret = Netlify.env.get("JWT_SECRET");

  if (!authorization?.startsWith("Bearer ") || !secret) return null;

  try {
    return jwt.verify(authorization.slice(7), secret) as TokenPayload;
  } catch {
    return null;
  }
};

export default async (req: Request) => {
  try {
    const path = new URL(req.url).pathname.replace(/^\/api/, "") || "/";

    if (req.method === "POST" && path === "/admin/login") {
      const { username, password } = await req.json();

      if (typeof username !== "string" || typeof password !== "string") {
        return json({ message: "Username and password are required" }, 400);
      }

      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.username, username))
        .limit(1);

      if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
        return json({ message: "Invalid username or password" }, 401);
      }

      const secret = Netlify.env.get("JWT_SECRET");
      if (!secret) return json({ message: "Admin login is not configured" }, 503);

      const token = jwt.sign(
        { adminId: admin.id, username: admin.username },
        secret,
        { expiresIn: "8h" },
      );

      return json({
        message: "Login successful",
        token,
        admin: { id: admin.id, username: admin.username },
      });
    }

    if (req.method === "POST" && path === "/requests") {
      const { name, phone, service, message } = await req.json();

      if (
        typeof name !== "string" || !name.trim() ||
        typeof phone !== "string" || !phone.trim() ||
        typeof service !== "string" || !service.trim()
      ) {
        return json({ message: "Name, phone and service are required" }, 400);
      }

      const [created] = await db
        .insert(serviceRequests)
        .values({
          name: name.trim(),
          phone: phone.trim(),
          service: service.trim(),
          message: typeof message === "string" && message.trim() ? message.trim() : null,
        })
        .returning({ id: serviceRequests.id });

      return json({ message: "Request submitted successfully", id: created.id }, 201);
    }

    const requestMatch = path.match(/^\/requests\/(\d+)$/);

    if (req.method === "GET" && requestMatch) {
      const [request] = await db
        .select()
        .from(serviceRequests)
        .where(eq(serviceRequests.id, Number(requestMatch[1])))
        .limit(1);

      if (!request) return json({ message: "Request not found" }, 404);
      return json(serializeRequest(request));
    }

    if (req.method === "GET" && path === "/requests") {
      if (!authenticate(req)) {
        return json({ message: "Access denied. No valid token provided." }, 401);
      }

      const requests = await db
        .select()
        .from(serviceRequests)
        .orderBy(desc(serviceRequests.createdAt));
      return json(requests.map(serializeRequest));
    }

    if (req.method === "PATCH" && requestMatch) {
      if (!authenticate(req)) {
        return json({ message: "Access denied. No valid token provided." }, 401);
      }

      const { status } = await req.json();
      if (typeof status !== "string" || !allowedStatuses.includes(status)) {
        return json({ message: "Invalid status" }, 400);
      }

      const [updated] = await db
        .update(serviceRequests)
        .set({ status })
        .where(eq(serviceRequests.id, Number(requestMatch[1])))
        .returning({ id: serviceRequests.id });

      if (!updated) return json({ message: "Request not found" }, 404);
      return json({ message: "Request status updated successfully" });
    }

    return json({ message: "API endpoint not found" }, 404);
  } catch (error) {
    console.error("API request failed", error);
    return json({ message: "Server error" }, 500);
  }
};

export const config: Config = {
  path: "/api/*",
};
