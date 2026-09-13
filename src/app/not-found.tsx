import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="section-label mb-4">404</p>
      <h1 className="font-display text-4xl md:text-5xl text-mist-100 mb-4">Page not found.</h1>
      <p className="text-mist-500 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-white hover:bg-signal-soft transition-colors">
        Back to home
      </Link>
    </div>
  );
}
