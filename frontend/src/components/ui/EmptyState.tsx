type Props = {
  title: string;
  text?: string;
  children?: React.ReactNode;
};

/** Shown when a list has no items. */
export function EmptyState({ title, text, children }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <h2 className="text-base font-medium text-gray-900">{title}</h2>
      {text && <p className="mt-1 text-sm text-gray-600">{text}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
