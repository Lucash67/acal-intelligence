export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-text-subtle">{label}</p>
      <p className="number mt-2 text-3xl tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}
