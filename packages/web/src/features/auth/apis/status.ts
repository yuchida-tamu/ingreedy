export async function statusFetcher() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return res.json();
}
