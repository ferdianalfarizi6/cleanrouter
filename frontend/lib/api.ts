// FORCE LOCALHOST 3000 for Debugging
export const API_URL = "https://cleanrouter.vercel.app";

console.log("[API] Configured URL:", API_URL);

if (!API_URL) {
  throw new Error("API URL tidak ditemukan.");
}

// =======================
// GENERIC FETCH
// =======================
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}${endpoint}`;
  console.log(`[API] Fetching ${url} ...`);

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    console.error("[API] Network Error:", err);
    throw new Error("Gagal terhubung ke server (Network Error). Pastikan backend berjalan.");
  }

  // Coba parse JSON, jika gagal anggap string/html error
  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    console.error(`[API] Error ${res.status}:`, data);
    throw new Error(data.message || `Error ${res.status}: Terjadi kesalahan`);
  }

  return data;
}
