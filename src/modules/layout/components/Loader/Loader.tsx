import { Skeleton } from "@/components/ui/skeleton";

interface LoaderProps {
  count?: number;
}

export function Loader({ count = 3 }: LoaderProps) {
  const CardSkeleton = () => (
    <div className="min-w-full md:min-w-md flex flex-col border border-indigo-100 rounded bg-gradient-to-br from-foreground/25 to-background m-0">
      <div className="flex w-full items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full bg-indigo-200/50" />
          <Skeleton className="h-3 w-20 bg-indigo-200/50" />
        </div>

        <Skeleton className="h-8 w-8 rounded bg-indigo-200/30" />
      </div>

      <div className="w-full px-4 pb-4">
        <Skeleton className="h-6 w-48 bg-indigo-200/30" />
      </div>

      <div className="w-full px-4 pb-4">
        <Skeleton className="h-2 w-48 bg-indigo-200/30" />
      </div>

      <div className="w-full py-3 px-4 bg-gradient-to-br from-foreground/60 to-foreground/10">
        <div className="flex gap-5 items-center flex-wrap">
          <div className="flex gap-1 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-indigo-100/40" />
            <Skeleton className="h-3 w-28 bg-indigo-100/40" />
          </div>
          <div className="flex gap-1 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-indigo-100/40" />
            <Skeleton className="h-3 w-28 bg-indigo-100/40" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex items-start gap-6 flex-wrap">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}
