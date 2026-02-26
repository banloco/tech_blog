export default function Loading() {
  return (
    <main className="min-h-screen bg-transparent">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="h-8 w-64 mx-auto animate-pulse" style={{ background: "#222" }} />
          <div className="h-12 w-full animate-pulse" style={{ background: "#222" }} />
          <div className="h-12 w-3/4 mx-auto animate-pulse" style={{ background: "#222" }} />
          <div className="h-6 w-96 mx-auto animate-pulse" style={{ background: "#1a1a1a" }} />
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-12 w-44 animate-pulse" style={{ background: "#222" }} />
            <div className="h-12 w-40 animate-pulse" style={{ background: "#1a1a1a" }} />
          </div>
        </div>
      </section>

      {/* Posts Grid Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 py-20 pb-32">
        <div className="h-9 w-64 animate-pulse mb-12" style={{ background: "#222" }} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 space-y-4"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
            >
              <div className="flex gap-3">
                <div className="h-4 w-24 animate-pulse" style={{ background: "#222" }} />
                <div className="h-4 w-16 animate-pulse" style={{ background: "#222" }} />
              </div>
              <div className="h-6 w-full animate-pulse" style={{ background: "#222" }} />
              <div className="h-6 w-2/3 animate-pulse" style={{ background: "#222" }} />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse" style={{ background: "#1a1a1a" }} />
                <div className="h-4 w-full animate-pulse" style={{ background: "#1a1a1a" }} />
                <div className="h-4 w-1/2 animate-pulse" style={{ background: "#1a1a1a" }} />
              </div>
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #2a2a2a" }}>
                <div className="h-6 w-16 animate-pulse" style={{ background: "#222" }} />
                <div className="h-8 w-8 animate-pulse" style={{ background: "#222" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
