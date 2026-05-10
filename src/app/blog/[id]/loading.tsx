import Skeleton from '@/components/Skeleton'

export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-72 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}
