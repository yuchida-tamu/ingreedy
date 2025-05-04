type SignInData = {
  email: string;
  password: string;
};

type SignInResponse =
  | {
      success: true;
      data: {
        message: string;
      };
    }
  | {
      success: false;
      message: string;
    };

export async function signinFetcher(data: SignInData): Promise<SignInResponse> {
  const response = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json() as Promise<SignInResponse>;
}
