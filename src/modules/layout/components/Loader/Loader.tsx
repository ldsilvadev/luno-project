import { Skeleton } from "@/components/ui/skeleton";

interface LoaderProps {
  count?: number;
}

export function Loader({ count = 3 }: LoaderProps) {
  const CardSkeleton = () => (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header com status e ações */}
      <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex-1">
          <Skeleton className="h-7 w-24 rounded-full bg-gray-200" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Título */}
        <Skeleton className="h-6 w-full mb-2 sm:mb-3 bg-gray-200" />
        <Skeleton className="h-6 w-3/4 mb-4 sm:mb-6 bg-gray-200" />
        
        {/* Descrição */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-5/6 bg-gray-200" />
          <Skeleton className="h-4 w-4/5 bg-gray-200" />
        </div>

        {/* Datas com ícones */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full bg-emerald-100" />
              <Skeleton className="h-4 w-12 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-24 ml-auto bg-gray-200" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full bg-rose-100" />
              <Skeleton className="h-4 w-8 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-24 ml-auto bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex justify-center">
          <CardSkeleton />
        </div>
      ))}
    </>
  );
}
