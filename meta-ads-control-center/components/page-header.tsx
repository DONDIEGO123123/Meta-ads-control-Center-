export default function PageHeader({
  title, subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-[32px] font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-ink-500 mt-1 text-[15px]">{subtitle}</p>}
    </header>
  );
}
