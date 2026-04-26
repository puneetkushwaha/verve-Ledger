import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <Skeleton className="h-4 w-96 opacity-20" />
        </div>
        <Skeleton className="h-16 w-48 rounded-2xl hidden lg:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Skeleton className="h-[450px] w-full rounded-[3rem]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[210px] w-full rounded-[2.5rem]" />
          <Skeleton className="h-[210px] w-full rounded-[2.5rem]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="h-[400px] w-full rounded-[3rem]" />
        <Skeleton className="h-[400px] w-full rounded-[3rem]" />
      </div>
    </div>
  );
}
