import Skeleton from '@/components/Skeleton'

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <Skeleton className="h-10 w-40 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
