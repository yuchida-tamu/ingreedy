import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="text-2xl">
      <h1>Welcome to Ingreedy</h1>
    </div>
  );
}
