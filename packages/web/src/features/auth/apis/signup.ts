type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export async function signupMutation(data: SignUpData) {
  const response = await fetch('http://localhost:8000/api/v1/users/createUser', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
