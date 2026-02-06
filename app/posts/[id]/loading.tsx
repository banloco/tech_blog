export default function PostLoading() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
      {/* Back link */}
      <div className="h-5 w-36 rounded bg-zinc-800 animate-pulse mb-8" />

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div className="flex gap-3">
          <div className="h-4 w-28 rounded bg-zinc-800 animate-pulse" />
          <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
        </div>
        <div className="h-10 w-full rounded-lg bg-zinc-800 animate-pulse" />
        <div className="h-10 w-3/4 rounded-lg bg-zinc-800 animate-pulse" />
        <div className="h-5 w-full rounded bg-zinc-800/60 animate-pulse mt-4" />
        <div className="h-5 w-2/3 rounded bg-zinc-800/60 animate-pulse" />
        <div className="flex gap-2 mt-6">
          <div className="h-6 w-16 rounded-md bg-zinc-800 animate-pulse" />
          <div className="h-6 w-20 rounded-md bg-zinc-800 animate-pulse" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-zinc-800/50 animate-pulse"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>

      {/* Divider */}
      <hr className="my-12 border-zinc-800" />

      {/* Comments skeleton */}
      <div className="space-y-4">
        <div className="h-7 w-40 rounded bg-zinc-800 animate-pulse" />
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-16 rounded bg-zinc-800/60 animate-pulse" />
            </div>
          </div>
          <div className="h-4 w-full rounded bg-zinc-800/50 animate-pulse pl-10" />
        </div>
      </div>
    </main>
  );
}
