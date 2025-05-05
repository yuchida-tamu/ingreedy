type Props = {
  children: React.ReactNode;
};

export function Debug({ children }: Props) {
  return import.meta.env.DEV ? children : null;
}
