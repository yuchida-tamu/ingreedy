export async function signoutFetcher() {
  const response = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
