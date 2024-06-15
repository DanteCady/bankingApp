'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const AuthForm = ({ type }: { type: string }) => {
	const [user, setuser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	// Define form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Handle form submission
	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		console.log(values);
		setIsLoading(false);
	}

	return (
		<section className="auth-form">
			<header className="flex flex-xol gap-5 md:gap-8">
				<Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
					<Image
						src="/icons/logo.svg"
						width={34}
						height={34}
						alt="Horizon logo"
					/>
					<h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
						Horizon
					</h1>
				</Link>
				<div className="flex flex-col gap-1 md:gap-3">
					<h1
						className="text-26 lg:text-36 
                    font-semibold text-gray-900"
					>
						{user ? `Link Account` : type === 'Sign-in' ? `Sign in` : `Sign up`}
						<p className="text-16 font-normal text-gray-600">
							{user
								? `Link your account to get started`
								: 'Please enter your details to get started'}
						</p>
					</h1>
				</div>
			</header>
			{user ? (
				<div className="flex flex-col gap-4">{/* Plaid Link */}</div>
			) : (
				<>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<div className="form-item">
										<FormLabel className="form-label">Email</FormLabel>
										<div className="flex w-full flex-col">
											<FormControl>
												<Input
													placeholder="Enter your email"
													className="input-class"
													{...field}
												/>
											</FormControl>
											<FormMessage className="form-message mt-2" />
										</div>
									</div>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<div className="form-item">
										<FormLabel className="form-label">Password</FormLabel>
										<div className="flex w-full flex-col">
											<FormControl>
												<Input
													placeholder="Enter your password"
													className="input-class"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage className="form-message mt-2" />
										</div>
									</div>
								)}
							/>
							<Button type="submit" className="form-btn">
								{isLoading ? (
									<>
										<Loader2 size={20} className="animate-spin" /> &nbsp;
										Loading...
									</>
								) : type === 'Sign-in' ? (
									`Sign In`
								) : (
									`Sign Up`
								)}
							</Button>
						</form>
					</Form>
				</>
			)}
		</section>
	);
};

export default AuthForm;
