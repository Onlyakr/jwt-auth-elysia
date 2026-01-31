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

const bookData = [
	{ title: "Book 1", slug: "book-1" },
	{ title: "Book 2", slug: "book-2" },
	{ title: "Book 3", slug: "book-3" },
	{ title: "Book 4", slug: "book-4" },
	{ title: "Book 5", slug: "book-5" },
];
/**
 * Seeds the database with predefined users and books.
 *
 * Deletes all existing books and users, then creates records from the module-level
 * `userData` and `bookData` arrays and logs each created entity's id.
 */
async function main() {
	console.log("Start seeding...");

	await prisma.book.deleteMany();
	await prisma.user.deleteMany();

	for (const user of userData) {
		const created = await prisma.user.create({
			data: user,
		});
		console.log(`Created user with id: ${created.id}`);
	}

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