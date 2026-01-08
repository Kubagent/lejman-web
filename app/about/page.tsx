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
      try {
        console.log('Fetching site settings...');
        const settings = await getSiteSettings();
        console.log('Site settings loaded:', settings);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
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

  const publications: any[] = [];
  const pressKitItems: any[] = [];
  const links: any[] = [];
  const interviews: any[] = [];

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
        {activeSection === 'biography' && !siteSettings && (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="font-body text-sm text-mid-gray">Loading biography...</p>
          </div>
        )}
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
                  {siteSettings.biography?.[locale] && siteSettings.biography[locale].trim() ? (
                    siteSettings.biography[locale].split('\n').map((paragraph, index) => (
                      <p key={index} style={{ marginBottom: '0.8rem' }}>
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p style={{ color: '#999999', fontStyle: 'italic' }}>
                      Biography content not available. Please add biography text in Sanity Studio at <a href="/studio" style={{textDecoration: 'underline'}}>dlejman.com/studio</a>
                    </p>
                  )}
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
          <div className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-serif text-lg text-[#666666] leading-relaxed">
                Publications will be available soon. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* Press Kit Section */}
        {activeSection === 'presskit' && (
          <div className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-serif text-lg text-[#666666] leading-relaxed">
                Press kit materials will be available soon. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* Links Section */}
        {activeSection === 'links' && (
          <div className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-serif text-lg text-[#666666] leading-relaxed">
                Links will be available soon. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* Interviews Section */}
        {activeSection === 'interviews' && (
          <div className="py-20 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-serif text-lg text-[#666666] leading-relaxed">
                Interviews will be available soon. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
