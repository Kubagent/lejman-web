'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSiteSettings, SiteSettings } from '@/lib/sanity/siteSettings';
import { urlFor } from '@/lib/sanity/image';
import { getPublications, Publication } from '@/lib/sanity/publications';
import { getPressKitItems, PressKitItem } from '@/lib/sanity/pressKit';
import { getLinks, Link } from '@/lib/sanity/links';
import { getInterviews, Interview } from '@/lib/sanity/interviews';
import { getFileAssetUrl } from '@/lib/sanity/file';

type AboutSection = 'biography' | 'publications' | 'presskit' | 'links' | 'interviews';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<AboutSection>('biography');
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pressKitItems, setPressKitItems] = useState<PressKitItem[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showSoonFor, setShowSoonFor] = useState<AboutSection | null>(null);
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

  // Load all content upfront to check availability
  useEffect(() => {
    async function loadAllContent() {
      try {
        const [pubData, pressData, linksData, interviewsData] = await Promise.all([
          getPublications(),
          getPressKitItems(),
          getLinks(),
          getInterviews(),
        ]);
        setPublications(pubData);
        setPressKitItems(pressData);
        setLinks(linksData);
        setInterviews(interviewsData);
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    }
    loadAllContent();
  }, []);

  // Check if a section has content
  const hasContent = (sectionId: AboutSection): boolean => {
    switch (sectionId) {
      case 'biography':
        return !!(siteSettings?.biography?.en || siteSettings?.biography?.de || siteSettings?.biography?.pl);
      case 'publications':
        return publications.length > 0;
      case 'presskit':
        return pressKitItems.length > 0;
      case 'links':
        return links.length > 0;
      case 'interviews':
        return interviews.length > 0;
      default:
        return false;
    }
  };

  // Handle section click
  const handleSectionClick = (sectionId: AboutSection) => {
    if (hasContent(sectionId)) {
      setActiveSection(sectionId);
      setShowSoonFor(null);
    } else {
      // Show "soon." message
      setShowSoonFor(sectionId);
      // Hide after 3 seconds
      setTimeout(() => setShowSoonFor(null), 3000);
    }
  };

  const sections = [
    { id: 'biography' as AboutSection, label: 'Biography' },
    { id: 'publications' as AboutSection, label: 'Publications' },
    { id: 'presskit' as AboutSection, label: 'Press Kit' },
    { id: 'links' as AboutSection, label: 'Links' },
    { id: 'interviews' as AboutSection, label: 'Interviews' },
  ];

  return (
    <div className="bg-white">
      <style jsx>{`
        @keyframes soonAppear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(5px);
          }
          40% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          60% {
            transform: scale(0.98) translateY(0);
          }
          80% {
            transform: scale(1.02) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Toggle Buttons */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E5E5]">
        <div className="px-6 md:px-12 lg:px-24 py-8">
          <div className="flex items-stretch gap-4 w-full flex-wrap lg:flex-nowrap">
            {sections.map((section) => (
              <div key={section.id} style={{ flex: '1 1 0', minWidth: '140px', position: 'relative' }}>
                {/* "soon." message above button */}
                {showSoonFor === section.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#000000',
                      animation: 'soonAppear 0.8s ease-out forwards',
                      whiteSpace: 'nowrap'
                    }}
                    role="status"
                    aria-live="polite"
                  >
                    soon.
                  </div>
                )}

                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full transition-all duration-300 ease-in-out ${
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
                    cursor: hasContent(section.id) ? 'pointer' : 'not-allowed',
                    outline: 'none',
                    textAlign: 'center',
                    opacity: hasContent(section.id) ? 1 : 0.6
                  }}
                >
                  {section.label}
                </button>
              </div>
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
            className="biography-section-outer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div
              className="biography-section-inner"
              style={{
                maxWidth: '1600px',
                width: '100%'
              }}
            >
              {/* Text Column - Left Side */}
              <div
                className="biography-text-column"
                style={{
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div
                  className="biography-text-content"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#333333',
                    textAlign: 'justify'
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
                className="biography-image-column"
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
            {publications.length > 0 ? (
              publications.map((pub, index) => (
                <div
                  key={pub._id}
                  className={`py-12 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  }`}
                  style={{
                    paddingLeft: '120px',
                    paddingRight: '120px'
                  }}
                >
                  <div className="max-w-4xl mx-auto flex items-center justify-between gap-8 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2">
                        {pub.title}
                      </h3>
                      <p className="font-sans text-sm text-[#666666]">
                        {pub.year}{" • "}{pub.format}{" • "}{pub.size}
                      </p>
                    </div>
                    <a
                      href={getFileAssetUrl(pub.file)}
                      download
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
              ))
            ) : (
              <div className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="font-serif text-lg text-[#666666] leading-relaxed">
                    Publications will be available soon. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Press Kit Section */}
        {activeSection === 'presskit' && (
          <div className="py-12">
            {pressKitItems.length > 0 ? (
              pressKitItems.map((item, index) => (
                <div
                  key={item._id}
                  className={`py-12 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  }`}
                  style={{
                    paddingLeft: '120px',
                    paddingRight: '120px'
                  }}
                >
                  <div className="max-w-4xl mx-auto flex items-center justify-between gap-8 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm text-[#666666]">
                        {item.format}{" • "}{item.size}
                      </p>
                    </div>
                    <a
                      href={getFileAssetUrl(item.file)}
                      download
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
              ))
            ) : (
              <div className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="font-serif text-lg text-[#666666] leading-relaxed">
                    Press kit materials will be available soon. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Links Section */}
        {activeSection === 'links' && (
          <div className="py-12">
            {links.length > 0 ? (
              links.map((link, index) => (
                <div
                  key={link._id}
                  className={`py-12 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  }`}
                  style={{
                    paddingLeft: '120px',
                    paddingRight: '120px'
                  }}
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
              ))
            ) : (
              <div className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="font-serif text-lg text-[#666666] leading-relaxed">
                    Links will be available soon. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interviews Section */}
        {activeSection === 'interviews' && (
          <div className="py-12">
            {interviews.length > 0 ? (
              interviews.map((interview, index) => (
                <div
                  key={interview._id}
                  className={`py-12 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  }`}
                  style={{
                    paddingLeft: '120px',
                    paddingRight: '120px'
                  }}
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
                        {interview.publication}{" • "}{interview.year}
                      </p>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="font-serif text-lg text-[#666666] leading-relaxed">
                    Interviews will be available soon. Please check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
