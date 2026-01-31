import { Elysia } from "elysia";

import auth from "./auth";
import books from "./books";
import openapi from "@elysiajs/openapi";

const app = new Elysia()
	.use(openapi())
	.use(auth)
	.use(books)
	.get("/", () => ({ status: "ok", message: "Server is healthy" }))
	.listen(3002);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
