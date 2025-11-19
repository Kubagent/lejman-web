import Link from 'next/link';
import Layout from '@/components/Layout';

/**
 * Exhibition Not Found (404) Page
 *
 * Displayed when a user navigates to an invalid exhibition slug
 * Provides a helpful message and link back to the exhibitions list
 */
export default function ExhibitionNotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16 md:px-12 lg:px-24">
        <div className="text-center max-w-2xl">
          {/* 404 Header */}
          <h1 className="font-serif text-6xl md:text-8xl font-semibold text-black mb-6">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark-gray mb-4">
            Exhibition Not Found
          </h2>

          <p className="text-base md:text-lg text-mid-gray mb-8 leading-relaxed">
            The exhibition you're looking for doesn't exist or may have been removed.
          </p>

          {/* Back to Exhibitions Link */}
          <Link
            href="/exhibitions"
            className="inline-flex items-center px-6 py-3 bg-black text-white hover:bg-dark-gray transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-focus rounded"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Exhibitions
          </Link>
        </div>
      </div>
    </Layout>
  );
}
