import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking packages...");
    const count = await prisma.package.count();
    console.log(`Found ${count} packages.`);

    if (count === 0) {
        console.log("Seeding default packages...");
        await prisma.package.createMany({
            data: [
                {
                    label: "Cuci Komplit (Reguler)",
                    serviceType: "REGULER",
                    price: 7000,
                },
                {
                    label: "Cuci Komplit (Express)",
                    serviceType: "EXPRESS",
                    price: 12000,
                },
                {
                    label: "Setrika Saja",
                    serviceType: "REGULER",
                    price: 5000,
                },
                {
                    label: "Cuci Bedcover",
                    serviceType: "REGULER",
                    price: 25000,
                }
            ],
        });
        console.log("Packages seeded!");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
