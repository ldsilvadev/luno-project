import { Skeleton } from "@/components/ui/skeleton";

interface LoaderProps {
  count?: number;
}

export function Loader({ count = 3 }: LoaderProps) {
  const CardSkeleton = () => (
    <div className="min-w-full md:min-w-md flex flex-col border border-indigo-100 rounded bg-gradient-to-br from-primary to-primary/20 m-0">
      {/* Header */}
      <div className="flex w-full items-center justify-between px-4 pt-2">
        {/* Status (icon + text) */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full bg-indigo-200/50" />
          <Skeleton className="h-3 w-20 bg-indigo-200/50" />
        </div>

        {/* Menu button (ellipsis) */}
        <Skeleton className="h-8 w-8 rounded bg-indigo-200/30" />
      </div>

      {/* Project name */}
      <div className="w-full px-4 pb-4">
        <Skeleton className="h-6 w-48 bg-indigo-200/30" />
      </div>

      {/* Dates band */}
      <div className="w-full py-3 px-4 bg-gradient-to-br from-indigo-900 to-indigo-200">
        <div className="flex gap-5 items-center flex-wrap">
          {/* Start date */}
          <div className="flex gap-1 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-indigo-100/40" />
            <Skeleton className="h-3 w-28 bg-indigo-100/40" />
          </div>
          {/* End date */}
          <div className="flex gap-1 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-indigo-100/40" />
            <Skeleton className="h-3 w-28 bg-indigo-100/40" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap -mx-3 justify-start">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}
