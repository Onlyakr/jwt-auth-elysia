import Elysia, { status, t } from "elysia";

import slugify from "slugify";
import { prisma } from "../../lib/prisma";

const books = new Elysia({ prefix: "/books" })
	.get("/", async () => {
		try {
			const books = await prisma.book.findMany();
			if (!books || books.length === 0) {
				return status(404, { success: false, message: "No books found" });
			}
			return status(200, { success: true, data: books });
		} catch (error) {
			const e = error as Error;
			return status(500, {
				success: false,
				message: e.message || "Internal Server Error",
			});
		}
	})
	.get(
		"/:slug",
		async ({ params: { slug } }) => {
			try {
				const book = await prisma.book.findUnique({
					where: {
						slug,
					},
				});
				if (!book) {
					return status(404, { success: false, message: "Book not found" });
				}
				return status(200, { success: true, data: book });
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{ params: t.Object({ slug: t.String() }) },
	)
	.post(
		"/",
		async ({ body }) => {
			try {
				const slug = slugify(body.title, { lower: true });
				const created = await prisma.book.create({
					data: {
						title: body.title,
						slug,
					},
				});
				return status(201, { success: true, data: created });
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{
			body: t.Object({ title: t.String() }),
		},
	)
	.put(
		"/:slug",
		async ({ params: { slug }, body }) => {
			try {
				const newSlug = slugify(body.title, { lower: true });
				const updated = await prisma.book.update({
					where: { slug },
					data: {
						title: body.title,
						slug: newSlug,
					},
				});
				return status(200, { success: true, data: updated });
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{
			params: t.Object({ slug: t.String() }),
			body: t.Object({ title: t.String() }),
		},
	)
	.delete(
		"/:slug",
		async ({ params: { slug } }) => {
			try {
				const deleted = await prisma.book.delete({
					where: { slug },
				});
				return status(200, { success: true, data: deleted });
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{
			params: t.Object({ slug: t.String() }),
		},
	);

export default books;
