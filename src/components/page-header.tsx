export function PageHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-b bg-secondary/60 py-12 text-center">
      <h1 className="section-title">{title}</h1>
      <p className="mt-3 text-muted-foreground">{text}</p>
    </div>
  );
}
