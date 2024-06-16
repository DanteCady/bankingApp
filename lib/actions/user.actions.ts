'use server';

import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { cookies } from 'next/headers';
import { encryptId, parseStringify } from '../utils';
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '../plaid';
import { link } from 'fs';
import { revalidatePath } from 'next/cache';
import { addFundingSource } from './dwolla.actions';
export const signIn = async ({ email, password }: signInProps) => {
	try {
		const { account } = await createAdminClient();
		const response = await account.createEmailPasswordSession(email, password);

		return parseStringify(response);
	} catch (error) {
		console.error(error);
	}
};

export const signUp = async (userData: SignUpParams) => {
	const { email, password, firstName, lastName } = userData;
	try {
		const { account } = await createAdminClient();
		const newUserAccount = await account.create(
			ID.unique(),
			email,
			password,
			`${firstName} ${lastName}`
		);
		const session = await account.createEmailPasswordSession(email, password);

		cookies().set('appwrite-session', session.secret, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
		});
		return parseStringify(newUserAccount);
	} catch (error) {
		console.error(error);
	}
};

export async function getLoggedInUser() {
	try {
		const { account } = await createSessionClient();
		const user = await account.get();
		return parseStringify(user);
	} catch (error) {
		return null;
	}
}

export const logoutAccount = async () => {
	try {
		const { account } = await createSessionClient();
		cookies().delete('appwrite-session');
		await account.deleteSession('current');
	} catch (error) {
		console.error(error);
	}
}

export const createLinkToken = async (user: any) => {
	try {
		const tokenParams = {
			user: {
				client_user_id: user.$id,
			},
			client_name: user.name,
			products: ['auth'] as Products[],
			language: 'en',
			country_codes: ['US'] as CountryCode[],
			}
			const response = await plaidClient().linkTokenCreate
			(tokenParams);
			return parseStringify({linkToken: response.data.link_token})
	} catch (error) {
		console.error(error);
	}
}

export const exchangePublicToken = async ({publicToken, user}: exchangePublicTokenProps) => {
	try {
		const response = await plaidClient().itemPublicTokenExchange({
			public_token: publicToken
		})
		const accessToken = response.data.access_token;
		const itemId = response.data.item_id;

		//Get the user's account
		const accountResponse = await plaidClient.accountsGet({
			access_Token: accessToken
		});

		const accountData = accountResponse.data.accounts[0];

		// Create a processor token for Dwolla using the Plaid access token and 
		// the account id
		const request: ProcessorTokenCreateRequest = {
			processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
			access_token: accessToken,
			account_id: accountData.account_id
		}
		// Geneerate the processor token
		const processorTokenResponse = await plaidClient.processorTokenCreate(request);
		const processorToken = processorTokenResponse.data.processor_token;

		// Create a funding source for the user using the processor token
		const fundingSourceURL = await addFundingSource({
			dwollaCustomerID: user.dwollaCustomerId,
			processorToken,
			bankName: accountData.name,
		});
		if (!fundingSourceURL) throw Error;
		// Create a bank account for the user using the processor token
		await createBankAccount({
			userID: user.$id,
			bankId: itemId,
			accessToken,
			fundingSourceURL,
			sharableId: encryptId(accountData.account_id),
		});

		// Revalidate the user's account
		revalidatePath('/');

		// Return success
		parseStringify({
			publicTokenExchange: "complete"
		});
	} catch (error) {
		console.error(error);
	}
}