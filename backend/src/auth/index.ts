import Elysia from "elysia";

new Elysia({ prefix: "/auth" }).get("/", () => "Hello Auth");
