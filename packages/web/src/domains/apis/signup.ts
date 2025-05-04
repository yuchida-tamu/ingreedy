type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export async function signupFetcher(data: SignUpData) {
  const response = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/users/createUser`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
