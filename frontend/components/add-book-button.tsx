"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

async function addBook(data: z.infer<typeof formSchema>) {
	const res = await fetch("http://localhost:8080/books", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	return await res.json();
}
const AddBookButton = () => {
	const [isAdding, setIsAdding] = useState(false);
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setIsAdding(true);

			const resData = await addBook(data);
			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success("Book added successfully");
			router.refresh();
		} catch {
			toast.error("Failed to add book. Please try again.");
		} finally {
			setIsAdding(false);
		}
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="cursor-pointer">Add Book</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Add Book</DialogTitle>
					<DialogDescription>Add a new book to the library.</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} id="add-book-form">
					<Controller
						control={form.control}
						name="title"
						render={({ field, fieldState }) => (
							<Field>
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									type="text"
									placeholder="Enter the book title"
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
				</form>
				<DialogFooter>
					<Button
						type="submit"
						form="add-book-form"
						className="w-full cursor-pointer"
						disabled={isAdding}
					>
						{isAdding ? (
							<div className="flex items-center gap-2">
								<Spinner />
								Adding book...
							</div>
						) : (
							"Add"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddBookButton;
