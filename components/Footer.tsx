'use client';

export default function Footer() {
  return (
    <footer className="relative w-full" style={{ height: '150px' }}>
      {/* Bottom Left - Copyright */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          left: '72px',
          zIndex: 10,
          fontFamily: 'Cormorant Garamond, serif'
        }}
      >
        <div className="text-xs md:text-sm text-mid-gray">
          <div>© Dominik Lejman</div>
          <div className="mt-1">
            represented by{' '}
            <a
              href="https://www.molskigallery.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline decoration-1 underline-offset-2 hover:text-[#666666] transition-colors"
            >
              Molski Gallery
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Right - Created By */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          right: '72px',
          zIndex: 10,
          fontFamily: 'Cormorant Garamond, serif'
        }}
      >
        <span className="text-xs md:text-sm text-mid-gray">
          created by{' '}
          <a
            href="https://0usia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline decoration-1 underline-offset-2 hover:text-[#666666] transition-colors"
          >
            0usia
          </a>
        </span>
      </div>
    </footer>
  );
}
