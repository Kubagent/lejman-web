'use client';

export default function PublicationsPage() {
  // Mock data for publications
  const publications = [
    {
      id: 1,
      title: 'Dominik Lejman: Air Wants to Go',
      year: 2020,
      format: 'PDF',
      size: '12.5 MB',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'Lunatics - Venice Biennale Catalog',
      year: 2022,
      format: 'PDF',
      size: '8.3 MB',
      downloadUrl: '#'
    },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Publications Content */}
      <div className="py-12">
        {publications.map((pub, index) => (
          <div
            key={pub.id}
            className={`px-6 md:px-12 lg:px-24 py-12 ${
              index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
            }`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-8 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2">
                  {pub.title}
                </h3>
                <p className="font-sans text-sm text-[#666666]">
                  {pub.year} · {pub.format} · {pub.size}
                </p>
              </div>
              <a
                href={pub.downloadUrl}
                className="bg-[#000000] text-[#FFFFFF] hover:bg-[#FAFAFA] hover:text-[#000000] transition-all duration-300"
                style={{
                  padding: '12px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  textDecoration: 'none',
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
