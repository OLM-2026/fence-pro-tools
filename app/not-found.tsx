import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-gold font-display font-bold text-sm tracking-widest uppercase mb-4">
        404
      </p>
      <h1 className="font-display font-bold text-4xl md:text-5xl text-navy mb-4">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="bg-navy text-white font-bold px-8 py-3 rounded-lg hover:bg-navy/80 transition-colors"
      >
        Back to directory
      </Link>
    </div>
  )
}
