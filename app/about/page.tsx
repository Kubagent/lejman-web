'use client';

import Link from 'next/link';

export default function AboutPage() {
  const sections = [
    { href: '/about/biography', label: 'Biography' },
    { href: '/about/publications', label: 'Publications' },
    { href: '/about/press-kit', label: 'Press Kit' },
    { href: '/about/links', label: 'Links' },
    { href: '/about/interviews', label: 'Interviews' },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Navigation Buttons */}
      <div className="px-6 md:px-12 lg:px-24 py-8">
        <div className="flex items-stretch gap-4 w-full flex-wrap lg:flex-nowrap">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-[#FAFAFA] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF] transition-all duration-300 ease-in-out"
              style={{
                border: 'none',
                padding: '16px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                cursor: 'pointer',
                outline: 'none',
                flex: '1 1 0',
                minWidth: '140px',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {section.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
