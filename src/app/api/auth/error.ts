// pages/api/auth/error.ts
export default function handler(req, res) {
    res.status(401).json({ error: req.query.error || "Unknown error" });
  }
  