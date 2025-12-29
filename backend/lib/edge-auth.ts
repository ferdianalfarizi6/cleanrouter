// lib/edge-auth.ts
import { NextRequest } from "next/server";

export function verifyAdminEdge(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  // ❗ TANPA jwt.verify
  // hanya cek token ADA atau tidak (atau pattern sederhana)

  return { role: "admin" }; // atau null
}
