export async function statusFetcher() {
  const res = await fetch(`${import.meta.env.VITE_APP_API_DOMAIN}/auth/status`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return res.json();
}
