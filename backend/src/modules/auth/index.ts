import Elysia, { status, t } from "elysia";
import { prisma } from "../../lib/prisma";

import jwt from "@elysiajs/jwt";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set");
}

const auth = new Elysia({ prefix: "/auth" })
	.use(
		jwt({
			name: "jwt",
			secret: process.env.JWT_SECRET!,
			exp: "7d",
		}),
	)
	.get("/me", async ({ cookie: { auth }, jwt }) => {
		try {
			const token = auth.value as string | undefined;
			if (!token) {
				return status(401, {
					success: false,
					message: "Unauthorized",
				});
			}

			const profile = await jwt.verify(token);
			if (!profile) {
				return status(401, {
					success: false,
					message: "Unauthorized",
				});
			}

			return status(200, {
				success: true,
				message: "User fetched successfully",
				data: profile,
			});
		} catch (error) {
			const e = error as Error;
			return status(500, {
				success: false,
				message: e.message || "Internal Server Error",
			});
		}
	})
	.post(
		"/sign-up",
		async ({ body, jwt, cookie: { auth } }) => {
			try {
				const user = await prisma.user.findUnique({
					where: {
						username: body.username,
					},
				});

				if (user) {
					return status(400, {
						success: false,
						message: "Username already exists",
					});
				}

				const hashedPassword = await Bun.password.hash(body.password);
				await prisma.user.create({
					data: {
						username: body.username,
						password: hashedPassword,
					},
				});

				const value = await jwt.sign({ username: body.username });

				auth.set({
					value,
					httpOnly: true,
					maxAge: 7 * 86400,
					path: "/",
				});

				return status(200, {
					success: true,
					message: "Signed up successfully",
				});
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
			}),
		},
	)
	.post(
		"/sign-in",
		async ({ body, jwt, cookie: { auth } }) => {
			try {
				const user = await prisma.user.findUnique({
					where: {
						username: body.username,
					},
				});
				if (!user) {
					return status(401, {
						success: false,
						message: "Invalid credentials",
					});
				}

				const isMatch = await Bun.password.verify(body.password, user.password);
				if (!isMatch) {
					return status(401, {
						success: false,
						message: "Invalid credentials",
					});
				}

				const value = await jwt.sign({ username: body.username });

				auth.set({
					value,
					httpOnly: true,
					maxAge: 7 * 86400,
					path: "/",
				});

				return status(200, {
					success: true,
					message: "Signed in successfully",
				});
			} catch (error) {
				const e = error as Error;
				return status(500, {
					success: false,
					message: e.message || "Internal Server Error",
				});
			}
		},
		{
			body: t.Object({
				username: t.String(),
				password: t.String(),
			}),
		},
	)
	.post("/sign-out", async ({ cookie: { auth } }) => {
		try {
			auth.remove();

			return status(200, {
				success: true,
				message: "Signed out successfully",
			});
		} catch (error) {
			const e = error as Error;
			return status(500, {
				success: false,
				message: e.message || "Internal Server Error",
			});
		}
	});

export default auth;
