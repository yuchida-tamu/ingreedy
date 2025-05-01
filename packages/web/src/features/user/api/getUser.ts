export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export async function getUserFetcher() {
  const response = await fetch('http://localhost:8000/api/v1/users/getUser', {
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
