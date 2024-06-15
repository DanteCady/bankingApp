'use server';

export const signIn = async (req, res) => {
	try {
	} catch (error) {
		console.error(error);
	}
};

export const signUp = async (userData: SignUpParams) => {
	try {
        // Create a user account
	} catch (error) {
		console.error(error);
	}
};

export async function getLoggedInUser() {
	try {
	  const { account } = await createSessionClient();
	  return await account.get();
	} catch (error) {
	  return null;
	}
  }