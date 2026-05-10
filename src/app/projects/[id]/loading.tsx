import Skeleton from '@/components/Skeleton'

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-80 w-full" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
