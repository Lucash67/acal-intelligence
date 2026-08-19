export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
