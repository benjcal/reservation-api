import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.serviceBay.createMany({
		data: [
			{ name: "Service Bay 1" },
			{ name: "Service Bay 2" },
			{ name: "Service Bay 3" },
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
