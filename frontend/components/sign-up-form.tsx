"use client";

import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z
	.object({
		username: z.string().min(1, "Username is required"),
		password: z.string().min(1, "Password is required"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

async function signUp(data: z.infer<typeof formSchema>) {
	const res = await fetch("http://localhost:8080/auth/sign-up", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	return await res.json();
}

export default function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSigningUp, setIsSigningUp] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setIsSigningUp(true);

			const resData = await signUp(data);

			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success("Signed up successfully");
			router.push("/");
		} catch (error) {
			const e = error as Error;
			toast.error(e.message || "Failed to sign up");
		} finally {
			setIsSigningUp(false);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Sign up for an account</CardTitle>
				</CardHeader>
				<CardContent>
					<form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
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
							<Controller
								name="confirmPassword"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											Confirm Password
										</FieldLabel>
										<Input
											id="confirmPassword"
											type="password"
											placeholder="Confirm your password"
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
							form="sign-up-form"
							disabled={isSigningUp}
							className="w-full"
						>
							{isSigningUp ? (
								<div className="flex items-center gap-2">
									<Spinner />
									<span>Signing Up...</span>
								</div>
							) : (
								<span>Sign Up</span>
							)}
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
