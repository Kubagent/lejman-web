'use client';

import Image from 'next/image';
import { Publication } from '@/lib/types';
import { FileText, Download, FileIcon } from 'lucide-react';

interface PublicationCardProps {
  publication: Publication;
  locale?: 'en' | 'de' | 'pl';
}

interface PublicationCardInternalProps extends PublicationCardProps {
  index?: number;
}

export default function PublicationCard({
  publication,
  locale = 'en',
  index = 0
}: PublicationCardInternalProps) {
  const title = publication.title[locale] || publication.title.en || '';
  const description = publication.description?.[locale] || publication.description?.en || '';
  const author = publication.author?.[locale] || publication.author?.en || '';

  // Get file type icon
  const getFileIcon = () => {
    switch (publication.type) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };

  // Format category display
  const getCategoryLabel = () => {
    const catMap: Record<string, Record<string, string>> = {
      essay: { en: 'Essay', de: 'Essay', pl: 'Esej' },
      catalog: { en: 'Catalog', de: 'Katalog', pl: 'Katalog' },
      interview: { en: 'Interview', de: 'Interview', pl: 'Wywiad' },
      press: { en: 'Press', de: 'Presse', pl: 'Prasa' },
      monograph: { en: 'Monograph', de: 'Monografie', pl: 'Monografia' },
      other: { en: 'Publication', de: 'Publikation', pl: 'Publikacja' }
    };
    return catMap[publication.category]?.[locale] || publication.category;
  };

  // Alternating background
  const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]';

  return (
    <article className={`group ${bgClass}`}>
      <a
        href={publication.fileUrl || '#'}
        download
        className="group flex gap-6 items-start py-10 px-6 md:px-8 no-underline"
        aria-label={`Download ${title}`}
      >
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Year */}
          <div className="flex items-baseline justify-between gap-6 mb-3">
            <h3 className="font-serif text-lg md:text-xl font-medium text-black group-hover:underline transition-all inline-block">
              {title}
            </h3>
            <span className="flex-shrink-0 font-sans text-sm text-[#999999]">
              {publication.year}
            </span>
          </div>

          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center text-xs text-[#999999] font-sans mb-2">
            <span className="uppercase tracking-wider">{getCategoryLabel()}</span>
            {author && (
              <span>{"\u00A0•\u00A0"}{author}</span>
            )}
            {publication.publisher && (
              <span>{"\u00A0•\u00A0"}{publication.publisher}</span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="font-sans text-sm text-[#666666] leading-relaxed line-clamp-2 mb-3">
              {description}
            </p>
          )}

          {/* Download Info */}
          <div className="flex items-center justify-end text-xs text-[#999999] font-sans mt-4">
            <span className="inline-flex items-center gap-1.5">
              <Download className="w-3 h-3" />
              {publication.type.toUpperCase()}
            </span>
            {publication.fileSize && <span>{"\u00A0•\u00A0"}{publication.fileSize}</span>}
          </div>
        </div>

        {/* Right: Small Thumbnail */}
        <div className="flex-shrink-0 w-16 md:w-20 h-20 md:h-28 bg-[#F5F5F5] overflow-hidden">
          {publication.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={publication.thumbnail.asset._ref}
                alt={`${title} cover`}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity duration-200"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#CCCCCC]">
              {getFileIcon()}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
