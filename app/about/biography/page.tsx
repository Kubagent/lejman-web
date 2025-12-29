'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSiteSettings, SiteSettings } from '@/lib/sanity/siteSettings';
import { urlFor } from '@/lib/sanity/image';

export default function BiographyPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const locale = 'en'; // TODO: Get from context

  useEffect(() => {
    async function loadSettings() {
      const settings = await getSiteSettings();
      setSiteSettings(settings);
    }
    loadSettings();
  }, []);

  if (!siteSettings) {
    return null;
  }

  return (
    <div className="bg-white">
      {/* 20px Spacer */}
      <div className="w-full bg-white" style={{ height: '20px' }} />

      {/* Biography Content */}
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
    </div>
  );
}
