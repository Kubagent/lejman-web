'use client';

export default function LinksPage() {
  // Mock data for links
  const links = [
    {
      id: 1,
      title: 'Official Website',
      url: 'https://dominiklejman.com',
      description: 'Personal portfolio and archive'
    },
    {
      id: 2,
      title: 'Instagram',
      url: 'https://instagram.com/dominiklejman',
      description: 'Latest works and updates'
    },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Links Content */}
      <div className="py-12">
        {links.map((link, index) => (
          <div
            key={link.id}
            className={`px-6 md:px-12 lg:px-24 py-12 ${
              index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2 group-hover:opacity-70 transition-opacity">
                  {link.title} →
                </h3>
                <p className="font-sans text-sm text-[#666666]">
                  {link.description}
                </p>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
