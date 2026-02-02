'use client';

import { useState } from 'react';

export default function Footer() {
  const [showOusiaText, setShowOusiaText] = useState(false);

  return (
    <footer className="relative w-full" style={{ height: '150px' }}>
      {/* Bottom Left - Copyright */}
      <div
        className="footer-copyright"
        style={{
          position: 'absolute',
          bottom: '72px',
          zIndex: 10,
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        <div className="text-xs md:text-sm text-mid-gray">
          <div>© 2026 Dominik Lejman</div>
        </div>
      </div>

      {/* Bottom Right - Created With */}
      <div
        className="footer-credit"
        style={{
          position: 'absolute',
          bottom: '72px',
          zIndex: 10,
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        <span className="text-xs md:text-sm text-mid-gray">
          created with{' '}
          <a
            href="https://0usia.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setShowOusiaText(true)}
            onMouseLeave={() => setShowOusiaText(false)}
            style={{
              color: '#000000',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
              cursor: 'pointer',
              display: 'inline-block'
            }}
            className="hover:opacity-70"
          >
            {showOusiaText ? '0usia' : '⊙'}
          </a>
        </span>
      </div>
    </footer>
  );
}
