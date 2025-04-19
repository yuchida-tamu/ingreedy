import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="home">
      <h1>Welcome to Ingreedy</h1>
    </div>
  );
}
