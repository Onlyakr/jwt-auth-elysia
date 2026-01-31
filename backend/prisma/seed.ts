import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const userData = [
	{ username: "admin", password: "admin" },
	{ username: "user", password: "user" },
];

async function main() {
	console.log("Start seeding...");

	await prisma.book.deleteMany();
	await prisma.user.deleteMany();

	const createdUsers: string[] = [];
	for (const user of userData) {
		const created = await prisma.user.create({
			data: user,
		});
		createdUsers.push(created.id);
		console.log(`Created user with id: ${created.id}`);
	}

	const bookData = [
		{ title: "Book 1", authorId: createdUsers[0] },
		{ title: "Book 2", authorId: createdUsers[1] },
		{ title: "Book 3", authorId: createdUsers[0] },
		{ title: "Book 4", authorId: createdUsers[1] },
		{ title: "Book 5", authorId: createdUsers[0] },
	];

	for (const book of bookData) {
		const created = await prisma.book.create({
			data: book,
		});
		console.log(`Created book with id: ${created.id}`);
	}
	console.log("Seeding finished.");
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
