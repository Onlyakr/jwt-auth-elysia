import Elysia from "elysia";

const auth = new Elysia({ prefix: "/auth" }).get("/", () => "Hello Auth");

export default auth;
