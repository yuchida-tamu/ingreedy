export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export async function getUserFetcher() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/getUser`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!data.success && data.error?.code === 'U006') {
    throw UnauthorizedError;
  } else if (!data.success) {
    throw new Error('Failed to fetch user');
  }

  return data.data;
}
