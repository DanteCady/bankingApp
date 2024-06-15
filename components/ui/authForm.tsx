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
import CustomInput from './customInput';
import { useRouter } from 'next/navigation';
import { authFormSchema } from '@/lib/utils';

const authFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const AuthForm = ({ type }: { type: string }) => {
	const [user, setuser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

	// Define form
	const form = useForm<z.infer<typeof authFormSchema>>({
		resolver: zodResolver(authFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Handle form submission
	const onSubmit = async (data: z.infer<typeof authFormSchema>) => {
		setIsLoading(true);

		try {
            // Sign up with Appwrite & create plaid link token
            if (type === 'Sign-up') {
                const newUser = await SignUp(data);

                setuser(user);
            } 
            if (type === 'Sign-in') {
                const response = await SignIn({
                    email: data.email,
                    password: data.password,
                
                });
                if(Response.status === 200) {
                    router.push('/');
                }
            } catch (error) {
            console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="auth-form">
			<header className="flex flex-col gap-5 md:gap-8">
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
							{type === 'Sign-up' && (
								<>
									<CustomInput
										control={form.control}
										name="firstName"
										label="First Name"
										placeholder="Enter your first name"
									/>
									<CustomInput
										control={form.control}
										name="lastName"
										label="Last Name"
										placeholder="Enter your last name"
									/>
									<CustomInput
										control={form.control}
										name="address"
										label="Address"
										placeholder="Enter your last address"
									/>
									<CustomInput
										control={form.control}
										name="state"
										label="State"
										placeholder="Example: NY"
									/>
                                    <CustomInput
										control={form.control}
										name="city"
										label="City"
										placeholder="Enter your city"
									/>
									<CustomInput
										control={form.control}
										name="postalCode"
										label="Postal Code"
										placeholder="Example: 10001"
									/>
									<CustomInput
										control={form.control}
										name="dateOfBirth"
										label="Date of Birth"
										placeholder="Example: YYYY-MM-DD"
									/>
								</>
							)}
							<CustomInput
								control={form.control}
								name="email"
								label="email"
								placeholder="Enter your email"
							/>
							<CustomInput
								control={form.control}
								name="password"
								label="password"
								placeholder="Enter your password"
							/>

							<div className="flex flex-col gap-4">
								<Button type="submit" className="form-btn" disabled={isLoading}>
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
							</div>
						</form>
					</Form>
					<footer className="flex justify-center gap-1">
						<p className="text-14 font-normal text-gray-600">
							{type === 'Sign-in'
								? `Don't have an account?`
								: `Already have an account?`}
						</p>
						<Link
							href={type === 'Sign-in' ? '/sign-up' : '/sign-in'}
							className="form-link"
						>
							{type === 'Sign-in' ? 'Sign up' : 'Sign in'}
						</Link>
					</footer>
				</>
			)}
		</section>
	);
};

export default AuthForm;
