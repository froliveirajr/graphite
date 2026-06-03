import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
