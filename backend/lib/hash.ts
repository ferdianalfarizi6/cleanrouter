import bcrypt from 'bcryptjs';

/**
 * Fungsi reusable untuk hashing password
 * @param password string password yang ingin di-hash
 * @returns hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // jumlah salt
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Fungsi reusable untuk memeriksa password
 * @param password plain password
 * @param hashed hashed password dari database
 * @returns true jika match
 */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}
