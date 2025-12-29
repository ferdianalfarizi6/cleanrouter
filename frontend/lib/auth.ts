import { API_URL } from "./api";

type AdminLoginPayload = {
  username: string;
  password: string;
};

type UserLoginPayload = {
  email: string;
  password: string;
};

type LoginPayload =
  | ({ role: "admin" } & AdminLoginPayload)
  | ({ role: "user" } & UserLoginPayload);

export async function login(payload: LoginPayload) {
  const isAdmin = payload.role === "admin";

  const endpoint = isAdmin
    ? `${API_URL}/api/admin/login`
    : `${API_URL}/api/user/login`;

  const body = isAdmin
    ? {
        username: payload.username,
        password: payload.password,
      }
    : {
        email: payload.email,
        password: payload.password,
      };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", payload.role);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}
