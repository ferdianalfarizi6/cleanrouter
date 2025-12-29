import { NextResponse } from "next/server";

export function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // res.headers.set("Access-Control-Allow-Credentials", "true"); // Optional if using cookies
  return res;
}
