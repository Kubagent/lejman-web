export default function Footer() {
  return (
    <footer className="bg-white border-t border-light-gray py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Copyright */}
          <p className="font-body text-sm text-mid-gray">
            © {new Date().getFullYear()} Dominik L. All rights reserved.
          </p>

          {/* Gallery Credit */}
          <div className="font-body text-sm text-mid-gray">
            <span>Represented by </span>
            <a
              href="https://molskigallery.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-dark-gray underline transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded"
              aria-label="Visit Molski Gallery website"
            >
              Molski Gallery
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
