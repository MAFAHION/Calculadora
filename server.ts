import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("database.sqlite");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    business_type TEXT,
    city TEXT,
    instagram TEXT,
    facebook TEXT,
    website TEXT,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/register", async (req, res) => {
    const { name, email, phone, businessType, city, instagram, facebook, website, password } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO users (name, email, phone, business_type, city, instagram, facebook, website, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(name, email, phone, businessType, city, instagram, facebook, website, password);

      // Webhook integration - explicitly sending all fields (Non-blocking)
      fetch("https://n8n.mafashionllc.com/webhook/595df768-d246-4dc4-b481-9e80e6154d7d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          businessType,
          city,
          instagram,
          facebook,
          website,
          password,
          timestamp: new Date().toISOString()
        }),
      }).catch(err => console.error("Webhook background failed:", err));

      const newUser = db.prepare("SELECT id, name, phone FROM users WHERE phone = ?").get(phone);
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Phone number already registered" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post("/api/login", (req, res) => {
    const { phone, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE phone = ? AND password = ?").get(phone, password);
    
    if (user) {
      res.json({ user: { id: user.id, name: user.name, phone: user.phone } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    const { password } = req.query;
    if (typeof password !== 'string' || password.trim() !== "samuel") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.delete("/api/admin/users", (req, res) => {
    const { password, ids } = req.body;
    if (typeof password !== 'string' || password.trim() !== "samuel") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided" });
    }
    const placeholders = ids.map(() => "?").join(",");
    db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...ids);
    res.json({ message: "Users deleted" });
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    if (typeof password !== 'string' || password.trim() !== "samuel") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ message: "User deleted" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
