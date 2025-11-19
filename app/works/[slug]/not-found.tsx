import Link from 'next/link';

/**
 * 404 Page for Invalid Artwork Slugs
 *
 * Displayed when a user navigates to /works/[invalid-slug]
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="font-heading text-6xl md:text-8xl font-semibold text-black mb-6">
          404
        </h1>
        <p className="font-body text-xl md:text-2xl text-dark-gray mb-8">
          Artwork not found
        </p>
        <p className="font-body text-base text-mid-gray mb-12">
          The artwork you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/works"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-body text-base hover:bg-dark-gray transition-colors rounded-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Archive
        </Link>
      </div>
    </div>
  );
}
