import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="grid gap-1">
        <h1 className="text-2xl md:text-3xl font-bold font-headline tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
