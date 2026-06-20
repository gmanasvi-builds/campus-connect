export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="gradient-hero rounded-b-3xl px-5 pb-5 pt-12 text-primary-foreground">
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-1 text-sm text-primary-foreground/80">{subtitle}</p>
    </header>
  );
}
