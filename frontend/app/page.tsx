export const dynamic = "force-dynamic";

import { buttonVariants } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";
import ActionBookButtons from "@/components/action-book-buttons";
import AddBookButton from "@/components/add-book-button";
import { toast } from "sonner";

type Book = {
	id: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
};

async function getUser() {
	try {
		const cookieStore = await cookies();
		const authCookie = cookieStore.get("auth");

		const res = await fetch("http://localhost:8080/auth/me", {
			headers: {
				Cookie: authCookie ? `auth=${authCookie.value}` : "",
			},
		});

		if (!res.ok) {
			throw new Error();
		}

		return await res.json();
	} catch {
		return {
			success: false,
		};
	}
}

async function getBooks() {
	try {
		const res = await fetch("http://localhost:8080/books");

		if (!res.ok) {
			throw new Error();
		}

		return await res.json();
	} catch {
		return {
			success: false,
		};
	}
}

export default async function Page() {
	const user = await getUser();
	const books = await getBooks();

	return (
		<div className="flex min-h-svh w-full flex-col">
			<header className="w-full bg-background/50 backdrop-blur-sm border-b border-border/50">
				<nav className="container mx-auto flex items-center justify-between gap-8 p-4">
					<h1 className="text-2xl font-bold">Books</h1>
					<div className="flex items-center gap-4">
						{user.success ? (
							<>
								<h1>Welcome, {user.data?.username}</h1>
								<SignOutButton />
							</>
						) : (
							<>
								<Link
									href="/sign-in"
									className={buttonVariants({ variant: "secondary" })}
								>
									Sign In
								</Link>
								<Link
									href="/sign-up"
									className={buttonVariants({ variant: "default" })}
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</nav>
			</header>
			<main className="container mx-auto p-4">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-xl font-semibold">Books list</h1>
					{user.success && <AddBookButton />}
				</div>
				{books.success ? (
					<Table>
						<TableBody>
							{books.data.map((book: Book) => (
								<TableRow key={book.id}>
									<TableCell className="font-medium">{book.title}</TableCell>
									{user.success && (
										<TableCell className="flex justify-end">
											<ActionBookButtons slug={book.slug} />
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<div className="flex items-center justify-center">
						<p className="text-gray-500">No books found</p>
					</div>
				)}
			</main>
		</div>
	);
}
