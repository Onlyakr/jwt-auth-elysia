"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

async function signOut() {
	const res = await fetch("http://localhost:8080/auth/sign-out", {
		method: "POST",
		credentials: "include",
	});

	return await res.json();
}

const SignOutButton = () => {
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			const resData = await signOut();

			if (!resData.success) {
				throw new Error(resData.message);
			}

			toast.success(resData.message);
			router.push("/");
		} catch (error) {
			const e = error as Error;
			toast.error(e.message || "Failed to sign out");
		}
	};

	return (
		<Button onClick={handleSignOut} className="cursor-pointer">
			Sign Out
		</Button>
	);
};
export default SignOutButton;
