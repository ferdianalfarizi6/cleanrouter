"use client";
import { redirect } from "next/navigation";

export default function DeprecatedDashboard() {
  redirect("/admin/dashboard");
}
