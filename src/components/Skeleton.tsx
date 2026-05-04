export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

export function SkeletonMenuItem() {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-gray-50 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded shrink-0"></div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - i * 15}%` }}
        ></div>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      <div className="h-10 bg-gray-100"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-50 border-t border-gray-100"></div>
      ))}
    </div>
  )
}
