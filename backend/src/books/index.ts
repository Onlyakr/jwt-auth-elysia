import Elysia from "elysia";

new Elysia({ prefix: "/books" }).get("/", () => "Hello Books");
