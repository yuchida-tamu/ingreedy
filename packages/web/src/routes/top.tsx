import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/top')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="join join-vertical gap-4">
        <h1 className="text-4xl font-bold text-center join-item">
          Welcome to Ingreedy
        </h1>
        <button className="btn btn-primary join-item">Login</button>
        <button className="btn btn-secondary join-item">Signup</button>
      </div>
    </div>
  );
}
