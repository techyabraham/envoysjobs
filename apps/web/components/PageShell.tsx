import React from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl mb-2">{title}</h1>
          {description ? (
            <p className="text-foreground-secondary">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
