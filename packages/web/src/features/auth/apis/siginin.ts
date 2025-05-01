type SignInData = {
  email: string;
  password: string;
};

export async function signinMutation(data: SignInData) {
  const response = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
