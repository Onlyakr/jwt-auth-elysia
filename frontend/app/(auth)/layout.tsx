import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<div className="flex flex-col gap-8 min-h-svh w-full items-center justify-center p-6 md:p-10">
				<Link href="/" className="text-2xl font-bold">
					Books
				</Link>
				{children}
			</div>
		</div>
	);
};
export default AuthLayout;
