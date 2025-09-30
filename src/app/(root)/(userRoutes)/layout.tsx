export default function UserLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="flex h-full w-full">{children}</div>;
}
