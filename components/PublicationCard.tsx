'use client';

import { WrittenWork } from '@/lib/types';

interface PublicationCardProps {
  writtenWork: WrittenWork;
  locale?: 'en' | 'de' | 'pl';
}

interface PublicationCardInternalProps extends PublicationCardProps {
  index?: number;
}

export default function PublicationCard({
  writtenWork,
  locale = 'en',
  index = 0
}: PublicationCardInternalProps) {
  const title = writtenWork.title[locale] || writtenWork.title.en || '';
  const description = writtenWork.description?.[locale] || writtenWork.description?.en || '';
  const author = writtenWork.author?.[locale] || writtenWork.author?.en || '';

  const getCategoryLabel = () => {
    const catMap: Record<string, Record<string, string>> = {
      essay: { en: 'Essay', de: 'Essay', pl: 'Esej' },
      review: { en: 'Review', de: 'Rezension', pl: 'Recenzja' },
      catalog: { en: 'Catalog', de: 'Katalog', pl: 'Katalog' },
      interview: { en: 'Interview', de: 'Interview', pl: 'Wywiad' },
      press: { en: 'Press', de: 'Presse', pl: 'Prasa' },
      monograph: { en: 'Monograph', de: 'Monografie', pl: 'Monografia' },
      statement: { en: 'Statement', de: 'Statement', pl: 'Wypowiedź' },
      other: { en: 'Publication', de: 'Publikation', pl: 'Publikacja' },
    };
    return catMap[writtenWork.category]?.[locale] || writtenWork.category;
  };

  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  return (
    <article
      className={bgClass}
      style={{ paddingLeft: '120px', paddingRight: '120px', paddingTop: '48px', paddingBottom: '48px' }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-8 flex-wrap">
        {/* Left: metadata */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-black mb-2">
            {title}
          </h3>
          <p className="font-sans text-sm text-[#666666]">
            {writtenWork.year}
            {getCategoryLabel() && <span>{" • "}{getCategoryLabel()}</span>}
            {author && <span>{" • "}{author}</span>}
          </p>
          {description && (
            <p className="font-sans text-sm text-[#999999] mt-2 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Right: download button */}
        {writtenWork.fileUrl && (
          <a
            href={writtenWork.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="bg-[#000000] hover:bg-[#FAFAFA] transition-all duration-300 flex-shrink-0"
            style={{
              padding: '12px 24px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              textDecoration: 'none',
              display: 'inline-block',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            aria-label={`Download ${title}`}
          >
            Download
          </a>
        )}
      </div>
    </article>
  );
}
