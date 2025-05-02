type SignInData = {
  email: string;
  password: string;
};

export async function signinMutation(data: SignInData) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
