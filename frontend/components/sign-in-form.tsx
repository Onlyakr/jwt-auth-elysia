"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
});

async function signIn(data: z.infer<typeof formSchema>) {
	const res = await fetch("http://localhost:8080/auth/sign-in", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	return await res.json();
}

export default function SignInForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSigningIn, setIsSigningIn] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setIsSigningIn(true);

			const resData = await signIn(data);
			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success("Signed in successfully");
			router.push("/");
		} catch (error) {
			const e = error as Error;
			toast.error(e.message || "Failed to sign in");
		} finally {
			setIsSigningIn(false);
		}
	}
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Sign in to your account</CardTitle>
				</CardHeader>
				<CardContent>
					<form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<Controller
								name="username"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel htmlFor="username">Username</FieldLabel>
										<Input
											id="username"
											type="text"
											placeholder="Enter your username"
											aria-invalid={fieldState.invalid}
											autoComplete="off"
											{...field}
										/>
										{fieldState.error && (
											<FieldError>{fieldState.error.message}</FieldError>
										)}
									</Field>
								)}
							/>
							<Controller
								name="password"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Input
											id="password"
											type="password"
											placeholder="Enter your password"
											aria-invalid={fieldState.invalid}
											autoComplete="off"
											{...field}
										/>
										{fieldState.error && (
											<FieldError>{fieldState.error.message}</FieldError>
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal">
						<Button
							type="submit"
							form="sign-in-form"
							disabled={isSigningIn}
							className="w-full"
						>
							{isSigningIn ? (
								<div className="flex items-center gap-2">
									<Spinner />
									<span>Signing In...</span>
								</div>
							) : (
								<span>Sign In</span>
							)}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
