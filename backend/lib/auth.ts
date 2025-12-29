import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

export function verifyAdmin(req: Request): TokenPayload | null {
  const auth = req.headers.get("authorization");
  console.log("AUTH HEADER:", auth);
  if (!auth) return null;

  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;
    console.log("AUTH PAYLOAD:", payload);

    if (payload.role !== "admin") {
      console.log("ROLE MISMATCH:", payload.role);
      return null;
    }

    return payload;
  } catch (e) {
    console.error("VERIFY TOKEN ERROR:", e);
    return null;
  }
}
