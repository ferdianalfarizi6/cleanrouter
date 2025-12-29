import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const packages = await prisma.package.findMany();
    console.log("Current packages:", JSON.stringify(packages, null, 2));

    // Fix prices if 0
    for (const pkg of packages) {
        if (pkg.price === 0) {
            console.log(`Fixing price for ${pkg.label}...`);
            let newPrice = 7000;
            if (pkg.serviceType === 'EXPRESS') newPrice = 12000;

            await prisma.package.update({
                where: { id: pkg.id },
                data: { price: newPrice }
            });
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
