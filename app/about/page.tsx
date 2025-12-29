'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSiteSettings, SiteSettings } from '@/lib/sanity/siteSettings';
import { urlFor } from '@/lib/sanity/image';

type AboutSection = 'biography' | 'publications' | 'presskit' | 'links' | 'interviews';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<AboutSection>('biography');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const locale = 'en'; // TODO: Get from context

  useEffect(() => {
    async function loadSettings() {
      const settings = await getSiteSettings();
      setSiteSettings(settings);
    }
    loadSettings();
  }, []);

  const sections = [
    { id: 'biography' as AboutSection, label: 'Biography' },
    { id: 'publications' as AboutSection, label: 'Publications' },
    { id: 'presskit' as AboutSection, label: 'Press Kit' },
    { id: 'links' as AboutSection, label: 'Links' },
    { id: 'interviews' as AboutSection, label: 'Interviews' },
  ];

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

  // Mock data for interviews
  const interviews = [
    {
      id: 1,
      title: 'Conversation on Contemporary Art',
      publication: 'Artforum',
      year: 2022,
      url: '#'
    },
    {
      id: 2,
      title: 'The Moving Image in Painting',
      publication: 'Frieze Magazine',
      year: 2021,
      url: '#'
    },
  ];

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Toggle Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E5E5]">
        <div className="px-6 md:px-12 lg:px-24 py-8">
          <div className="flex items-stretch gap-4 w-full flex-wrap lg:flex-nowrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`transition-all duration-300 ease-in-out ${
                  activeSection === section.id
                    ? 'bg-[#000000] text-[#FFFFFF]'
                    : 'bg-[#FAFAFA] text-[#000000] hover:bg-[#000000] hover:text-[#FFFFFF]'
                }`}
                style={{
                  border: 'none',
                  padding: '16px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  fontWeight: activeSection === section.id ? 500 : 400,
                  cursor: 'pointer',
                  outline: 'none',
                  flex: '1 1 0',
                  minWidth: '140px',
                  textAlign: 'center'
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div>
        {/* Biography Section */}
        {activeSection === 'biography' && siteSettings && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '60px',
              paddingBottom: '60px',
              paddingLeft: '120px',
              paddingRight: '120px',
              position: 'relative'
            }}
          >
            <div
              style={{
                maxWidth: '1600px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '60px'
              }}
            >
              {/* Text Column - Left Side */}
              <div
                style={{
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#333333',
                    textAlign: 'justify',
                    paddingRight: '20px'
                  }}
                >
                  {siteSettings.biography[locale]?.split('\n').map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: '0.8rem' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Image - Right Side */}
              <div
                style={{
                  flex: '0 0 45%',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: '100%' }}>
                  {siteSettings.biographyImage ? (
                    <Image
                      src={urlFor(siteSettings.biographyImage).url()}
                      alt={siteSettings.biographyImage.alt || 'Biography portrait'}
                      width={800}
                      height={1200}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      priority
                    />
                  ) : (
                    <Image
                      src="/images/bio/dominik-lejman.jpg"
                      alt="Dominik Lejman"
                      width={800}
                      height={1200}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                      priority
                    />
                  )}
                </div>
                {siteSettings.biographyImage?.caption && (
                  <div
                    style={{
                      marginTop: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.75rem',
                      color: '#666666',
                      textAlign: 'right'
                    }}
                  >
                    {siteSettings.biographyImage.caption}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Publications Section */}
        {activeSection === 'publications' && (
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
                    className="bg-[#000000] hover:bg-[#FAFAFA] transition-all duration-300"
                    style={{
                      padding: '12px 24px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Press Kit Section */}
        {activeSection === 'presskit' && (
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
                    className="bg-[#000000] hover:bg-[#FAFAFA] transition-all duration-300"
                    style={{
                      padding: '12px 24px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      textDecoration: 'none',
                      display: 'inline-block',
                      textAlign: 'center',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Links Section */}
        {activeSection === 'links' && (
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
        )}

        {/* Interviews Section */}
        {activeSection === 'interviews' && (
          <div className="py-12">
            {interviews.map((interview, index) => (
              <div
                key={interview.id}
                className={`px-6 md:px-12 lg:px-24 py-12 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                }`}
              >
                <div className="max-w-4xl mx-auto">
                  <a
                    href={interview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2 group-hover:opacity-70 transition-opacity">
                      {interview.title} →
                    </h3>
                    <p className="font-sans text-sm text-[#666666]">
                      {interview.publication} · {interview.year}
                    </p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
