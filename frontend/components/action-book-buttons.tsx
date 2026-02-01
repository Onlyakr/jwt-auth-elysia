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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldError } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

async function deleteBook(slug: string) {
	const res = await fetch(`http://localhost:8080/books/${slug}`, {
		method: "DELETE",
		credentials: "include",
	});
	return await res.json();
}

async function updateBook(slug: string, data: z.infer<typeof formSchema>) {
	const res = await fetch(`http://localhost:8080/books/${slug}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	return await res.json();
}

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

const ActionBookButtons = ({ slug }: { slug: string }) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	const handleDelete = async () => {
		try {
			setIsDeleting(true);

			const resData = await deleteBook(slug);
			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success("Book deleted successfully");
			router.refresh();
		} catch {
			toast.error("Failed to delete book. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setIsEditing(true);

			const resData = await updateBook(slug, data);
			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success("Book updated successfully");
			router.refresh();
		} catch {
			toast.error("Failed to update book. Please try again.");
		} finally {
			setIsEditing(false);
		}
	}

	return (
		<div className="flex gap-2">
			<Dialog>
				<DialogTrigger asChild>
					<Button className="cursor-pointer" variant="secondary">
						Edit Book
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Edit Book</DialogTitle>
						<DialogDescription>Edit the book details.</DialogDescription>
					</DialogHeader>
					<form onSubmit={form.handleSubmit(onSubmit)} id="edit-book-form">
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
							form="edit-book-form"
							className="w-full cursor-pointer"
							disabled={isEditing}
						>
							{isEditing ? (
								<div className="flex items-center gap-2">
									<Spinner />
									Editing book...
								</div>
							) : (
								"Edit"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Button
				variant="destructive"
				onClick={handleDelete}
				disabled={isDeleting}
				className="w-16 cursor-pointer"
			>
				{isDeleting ? (
					<div className="flex items-center gap-2">
						<Spinner />
					</div>
				) : (
					"Delete"
				)}
			</Button>
		</div>
	);
};
export default ActionBookButtons;
