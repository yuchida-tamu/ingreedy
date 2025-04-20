import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-center ">Welcome to Ingreedy</h1>
        <Link from="/auth" to="/auth/signin" className="btn btn-primary ">
          Signin
        </Link>
        <Link from="/auth" to="/auth/signup" className="btn btn-accent">
          Signup
        </Link>
      </div>
    </div>
  );
}
