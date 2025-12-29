import { groq } from 'next-sanity';

// River Videos - ordered by display order
export const riverVideosQuery = groq`
  *[_type == "riverVideo"] | order(order asc) {
    _id,
    title,
    order,
    video {
      asset->{
        _id,
        playbackId,
        status,
        data {
          aspect_ratio,
          max_stored_resolution,
          max_stored_frame_rate,
          duration
        }
      }
    },
    posterImage,
    description,
    year,
    linkedArtwork-> {
      slug
    }
  }
`;

// All Artworks - ordered by year desc
export const artworksQuery = groq`
  *[_type == "artwork"] | order(year desc) {
    _id,
    title,
    slug,
    year,
    medium,
    dimensions,
    images,
    description
  }
`;

// Single Artwork by slug
export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    medium,
    dimensions,
    images,
    description,
    exhibitions[]-> {
      _id,
      title,
      venue,
      location,
      startDate,
      endDate
    }
  }
`;

// All Exhibitions - ordered by startDate desc
export const exhibitionsQuery = groq`
  *[_type == "exhibition"] | order(startDate desc) {
    _id,
    title,
    slug,
    venue,
    location,
    startDate,
    endDate,
    type,
    images
  }
`;

// Single Exhibition by slug
export const exhibitionBySlugQuery = groq`
  *[_type == "exhibition" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    venue,
    location,
    startDate,
    endDate,
    type,
    description,
    images,
    artworks[]-> {
      _id,
      title,
      slug,
      year,
      images
    }
  }
`;

// All Texts - ordered by publishedDate desc
export const textsQuery = groq`
  *[_type == "publication"] | order(publishedDate desc) {
    _id,
    title,
    slug,
    author,
    publishedDate,
    category,
    excerpt
  }
`;

// Single Text by slug
export const textBySlugQuery = groq`
  *[_type == "publication" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author,
    publishedDate,
    category,
    content,
    excerpt
  }
`;

// Site Settings - singleton
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    artistName,
    contactEmail,
    galleryEmail,
    galleryName,
    galleryUrl,
    biography,
    biographyImage,
    metaDescription
  }
`;
