export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
