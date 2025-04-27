type SignUpData = {
  username: string;
  email: string;
  password: string;
};

export async function signupMutation(data: SignUpData) {
  const response = await fetch('http://127.0.0.1:3000/api/v1/users/createUser', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
