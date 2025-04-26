import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  title: string;
  imageSrc: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}>;

export function HeroFormContainer({ children, title, imageSrc, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="hero min-h-screen">
        <div className="hero-content bg-secondary-content flex-col rounded-lg lg:flex-row">
          <img src={imageSrc} className="max-w-sm rounded-lg" />
          <div className="flex h-full flex-col gap-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </form>
  );
}
