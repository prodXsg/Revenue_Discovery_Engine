import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded border border-border p-5 space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="px-5 py-2.5 border-b border-border flex gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-8">
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-10 ml-auto" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>

      {/* Deep Dive Skeleton */}
      <div className="bg-card rounded border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-6 w-28 rounded" />
          </div>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
