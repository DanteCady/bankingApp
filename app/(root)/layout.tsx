import type { Metadata } from 'next';
import { Inter, IBM_Plex_Serif } from 'next/font/google';
import Sidebar from '@/components/ui/sideBar';
import Image from 'next/image';
import MobileNav from '@/components/ui/mobileNavbar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const loggedIn = { firstName: 'John', lastName: 'Doe' };

	return (
		<main className="flex h-screen w-full font-inter">
			<Sidebar user={loggedIn} />
			<div className="flex size-full flex-col">
				<div className="root-layout">
					<Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
				<div>
					<MobileNav user={loggedIn} />
				</div>
				</div>
			{children}
      </div>
		</main>
	);
}
