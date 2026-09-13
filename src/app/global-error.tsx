"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body className="bg-ink-950 text-mist-100">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <p className="text-signal-soft font-mono text-xs uppercase tracking-widest mb-4">Something went wrong</p>
          <h1 className="font-display text-3xl mb-4">An unexpected error occurred.</h1>
          <button
            onClick={reset}
            className="rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
