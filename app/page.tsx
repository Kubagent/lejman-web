import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-48">
          <h1 className="font-heading text-4xl md:text-6xl font-semibold text-black mb-6">
            River
          </h1>
          <p className="font-body text-base md:text-lg text-dark-gray max-w-2xl">
            The River module will feature 5 auto-playing videos in a continuous vertical scroll.
            This space showcases motion-based work in a contemplative digital environment.
          </p>
          <p className="font-body text-sm text-mid-gray mt-12">
            Coming soon: Scroll-triggered video playback with Intersection Observer
          </p>
        </div>
      </div>
    </Layout>
  );
}
