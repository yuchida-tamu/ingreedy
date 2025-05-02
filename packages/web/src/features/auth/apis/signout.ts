export async function signoutFetcher() {
  const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
