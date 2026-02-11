import { groq } from 'next-sanity';

// Intro Video - first river video by order (used for intro overlay)
export const introVideoQuery = groq`
  *[_type == "riverVideo"] | order(order asc)[0] {
    _id,
    title,
    video {
      asset->{
        playbackId
      }
    },
    posterImage
  }
`;

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
      _type,
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
    customDimensions,
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
    customDimensions,
    images,
    description,
    projects[]-> {
      _id,
      title,
      venue,
      location,
      startDate,
      endDate
    }
  }
`;

// All Projects - ordered by startDate desc
export const projectsQuery = groq`
  *[_type == "project"] | order(startDate desc) {
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

// Single Project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
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

// All Written Works - ordered by publishedDate desc
export const writtenWorksQuery = groq`
  *[_type == "writtenWork"] | order(publishedDate desc) {
    _id,
    title,
    slug,
    author,
    publishedDate,
    category,
    excerpt
  }
`;

// Single Written Work by slug
export const writtenWorkBySlugQuery = groq`
  *[_type == "writtenWork" && slug.current == $slug][0] {
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
