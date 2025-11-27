'use client';

import dynamic from 'next/dynamic';

const StudioWrapper = dynamic(() => import('./StudioWrapper'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      Loading Sanity Studio...
    </div>
  ),
});

export default function StudioPage() {
  return <StudioWrapper />;
}
