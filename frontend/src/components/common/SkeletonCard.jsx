export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div>
    </div>
  );
}
