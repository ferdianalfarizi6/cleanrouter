import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("adminjaya123", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      password: password
    }
  });

  console.log("Admin created!");
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
