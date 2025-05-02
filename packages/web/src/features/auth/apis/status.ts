export async function statusFetcher() {
  const res = await fetch('http://localhost:8000/api/v1/auth/status', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return res.json();
}
