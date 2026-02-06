export default function Loading() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="h-8 w-64 mx-auto rounded-full bg-zinc-800 animate-pulse" />
          <div className="h-12 w-full rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-12 w-3/4 mx-auto rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-6 w-96 mx-auto rounded-lg bg-zinc-800/60 animate-pulse" />
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-12 w-44 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-12 w-40 rounded-full bg-zinc-800/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Posts Grid Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 py-20 pb-32">
        <div className="h-9 w-64 rounded-lg bg-zinc-800 animate-pulse mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4"
            >
              <div className="flex gap-3">
                <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse" />
                <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
              </div>
              <div className="h-6 w-full rounded bg-zinc-800 animate-pulse" />
              <div className="h-6 w-2/3 rounded bg-zinc-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-zinc-800/60 animate-pulse" />
                <div className="h-4 w-full rounded bg-zinc-800/60 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-zinc-800/60 animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                <div className="h-6 w-16 rounded-md bg-zinc-800 animate-pulse" />
                <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
