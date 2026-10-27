type Props = {
  title: string;
  children?: React.ReactNode; // buttons on the right side
};

export function PageHeader({ title, children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
