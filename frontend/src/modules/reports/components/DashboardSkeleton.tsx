const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Skeleton header */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-24 animate-pulse rounded-full bg-tertiary" />

          <div className="h-7 w-56 animate-pulse rounded-lg bg-tertiary" />
        </div>

        <div className="h-9 w-36 animate-pulse rounded-lg bg-tertiary" />
      </div>

      {/* Skeleton KPI cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-border bg-secondary p-5"
          >
            <div className="h-3 w-20 animate-pulse rounded-full bg-tertiary" />

            <div className="h-8 w-28 animate-pulse rounded-lg bg-tertiary" />

            <div className="h-3 w-24 animate-pulse rounded-full bg-tertiary" />
          </div>
        ))}
      </div>

      {/* Skeleton charts */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="h-72 animate-pulse rounded-xl border border-border bg-secondary" />

        <div className="h-72 animate-pulse rounded-xl border border-border bg-secondary" />
      </div>

      {/* Skeleton table */}

      <div className="overflow-hidden rounded-xl border border-border bg-secondary">
        <div className="border-b border-border bg-tertiary px-5 py-4">
          <div className="h-3 w-28 animate-pulse rounded-full bg-secondary" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
          >
            <div className="h-3 w-16 animate-pulse rounded-full bg-tertiary" />

            <div className="h-3 w-10 animate-pulse rounded-full bg-tertiary" />

            <div className="h-3 flex-1 animate-pulse rounded-full bg-tertiary" />

            <div className="h-3 w-14 animate-pulse rounded-full bg-tertiary" />

            <div className="h-5 w-20 animate-pulse rounded-full bg-tertiary" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
