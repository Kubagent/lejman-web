'use client';

export default function PressKitPage() {
  // Mock data for press kit
  const pressKitItems = [
    {
      id: 1,
      title: 'Artist Biography & CV',
      format: 'PDF',
      size: '245 KB',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: 'High Resolution Images Pack',
      format: 'ZIP',
      size: '156 MB',
      downloadUrl: '#'
    },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Press Kit Content */}
      <div className="py-12">
        {pressKitItems.map((item, index) => (
          <div
            key={item.id}
            className={`px-6 md:px-12 lg:px-24 py-12 ${
              index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
            }`}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-8 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-[#666666]">
                  {item.format} · {item.size}
                </p>
              </div>
              <a
                href={item.downloadUrl}
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
