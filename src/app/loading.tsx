import Skeleton from '@/components/Skeleton'

// Public sayfalar için global loading state (örn. anasayfa)
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-6">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
