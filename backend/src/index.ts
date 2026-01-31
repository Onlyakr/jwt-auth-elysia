import { Elysia } from "elysia";

import openapi from "@elysiajs/openapi";
import auth from "./modules/auth";
import books from "./modules/books";

const app = new Elysia()
	.use(openapi())
	.use(auth)
	.use(books)
	.get("/", () => ({ status: "ok", message: "Server is healthy" }))
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
