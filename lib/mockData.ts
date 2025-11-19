import { RiverVideo, Artwork, Exhibition } from './types';

/**
 * Mock River Videos for Development/Preview
 *
 * Uses publicly available sample videos from various sources.
 * Replace these with real Sanity content once CMS is populated.
 */
export const mockRiverVideos: RiverVideo[] = [
  {
    _id: 'mock-1',
    title: {
      en: 'Abstract Motion I',
      de: 'Abstrakte Bewegung I',
      pl: 'Abstrakcyjny Ruch I'
    },
    description: {
      en: 'Exploration of color and movement in digital space',
      de: 'Erforschung von Farbe und Bewegung im digitalen Raum',
      pl: 'Eksploracja koloru i ruchu w przestrzeni cyfrowej'
    },
    order: 1,
    year: 2024,
    videoFile: {
      _type: 'file',
      asset: {
        _ref: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        _type: 'reference'
      }
    },
    posterImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/1920/1080?random=1',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'mock-2',
    title: {
      en: 'Urban Flows',
      de: 'Urbane Flüsse',
      pl: 'Miejskie Przepływy'
    },
    description: {
      en: 'Time-based media exploring city rhythms',
      de: 'Zeitbasierte Medien erkunden Stadtrhythmen',
      pl: 'Media czasowe badające rytmy miasta'
    },
    order: 2,
    year: 2024,
    videoFile: {
      _type: 'file',
      asset: {
        _ref: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        _type: 'reference'
      }
    },
    posterImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/1920/1080?random=2',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'mock-3',
    title: {
      en: 'Digital Landscapes',
      de: 'Digitale Landschaften',
      pl: 'Cyfrowe Krajobrazy'
    },
    description: {
      en: 'Synthetic environments and virtual terrains',
      de: 'Synthetische Umgebungen und virtuelle Terrains',
      pl: 'Syntetyczne środowiska i wirtualne tereny'
    },
    order: 3,
    year: 2023,
    videoFile: {
      _type: 'file',
      asset: {
        _ref: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        _type: 'reference'
      }
    },
    posterImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/1920/1080?random=3',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'mock-4',
    title: {
      en: 'Temporal Studies II',
      de: 'Zeitstudien II',
      pl: 'Studia Czasowe II'
    },
    description: {
      en: 'Investigation of duration and perception',
      de: 'Untersuchung von Dauer und Wahrnehmung',
      pl: 'Badanie czasu trwania i percepcji'
    },
    order: 4,
    year: 2023,
    videoFile: {
      _type: 'file',
      asset: {
        _ref: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        _type: 'reference'
      }
    },
    posterImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/1920/1080?random=4',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'mock-5',
    title: {
      en: 'Chromatic Variations',
      de: 'Chromatische Variationen',
      pl: 'Wariacje Chromatyczne'
    },
    description: {
      en: 'Sequential color field compositions',
      de: 'Sequentielle Farbfeldkompositionen',
      pl: 'Sekwencyjne kompozycje pól kolorów'
    },
    order: 5,
    year: 2022,
    videoFile: {
      _type: 'file',
      asset: {
        _ref: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        _type: 'reference'
      }
    },
    posterImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/1920/1080?random=5',
        _type: 'reference'
      }
    }
  }
];

/**
 * Mock Artworks for Development/Preview
 *
 * Uses placeholder images from Picsum for development.
 * Replace these with real Sanity content once CMS is populated.
 */
export const mockArtworks: Artwork[] = [
  {
    _id: 'artwork-1',
    title: {
      en: 'Untitled (Blue Series)',
      de: 'Ohne Titel (Blaue Serie)',
      pl: 'Bez tytułu (Seria niebieska)'
    },
    slug: {
      _type: 'slug',
      current: 'untitled-blue-series'
    },
    year: 2024,
    medium: {
      en: 'Oil on canvas',
      de: 'Öl auf Leinwand',
      pl: 'Olej na płótnie'
    },
    dimensions: {
      width: 120,
      height: 150,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art1/800/800',
        _type: 'reference'
      }
    },
    images: [],
    description: {
      en: 'Exploration of color relationships and spatial depth through layered brushwork.',
      de: 'Erforschung von Farbbeziehungen und räumlicher Tiefe durch geschichtete Pinselarbeit.',
      pl: 'Eksploracja relacji kolorystycznych i głębi przestrzennej poprzez warstwową pracę pędzla.'
    },
    featured: true
  },
  {
    _id: 'artwork-2',
    title: {
      en: 'Landscape Memory IV',
      de: 'Landschaftserinnerung IV',
      pl: 'Pamięć krajobrazu IV'
    },
    slug: {
      _type: 'slug',
      current: 'landscape-memory-iv'
    },
    year: 2024,
    medium: {
      en: 'Mixed media on paper',
      de: 'Mischtechnik auf Papier',
      pl: 'Technika mieszana na papierze'
    },
    dimensions: {
      width: 70,
      height: 100,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art2/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-3',
    title: {
      en: 'Digital Fragments',
      de: 'Digitale Fragmente',
      pl: 'Fragmenty cyfrowe'
    },
    slug: {
      _type: 'slug',
      current: 'digital-fragments'
    },
    year: 2023,
    medium: {
      en: 'Digital print',
      de: 'Digitaldruck',
      pl: 'Wydruk cyfrowy'
    },
    dimensions: {
      width: 90,
      height: 60,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art3/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: true
  },
  {
    _id: 'artwork-4',
    title: {
      en: 'Temporal Study II',
      de: 'Zeitstudie II',
      pl: 'Studium czasowe II'
    },
    slug: {
      _type: 'slug',
      current: 'temporal-study-ii'
    },
    year: 2023,
    medium: {
      en: 'Acrylic on canvas',
      de: 'Acryl auf Leinwand',
      pl: 'Akryl na płótnie'
    },
    dimensions: {
      width: 100,
      height: 120,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art4/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-5',
    title: {
      en: 'Monochrome Variations',
      de: 'Monochrome Variationen',
      pl: 'Wariacje monochromatyczne'
    },
    slug: {
      _type: 'slug',
      current: 'monochrome-variations'
    },
    year: 2023,
    medium: {
      en: 'Charcoal on paper',
      de: 'Kohle auf Papier',
      pl: 'Węgiel na papierze'
    },
    dimensions: {
      width: 50,
      height: 70,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art5/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-6',
    title: {
      en: 'Urban Rhythms',
      de: 'Urbane Rhythmen',
      pl: 'Rytmy miejskie'
    },
    slug: {
      _type: 'slug',
      current: 'urban-rhythms'
    },
    year: 2022,
    medium: {
      en: 'Oil on canvas',
      de: 'Öl auf Leinwand',
      pl: 'Olej na płótnie'
    },
    dimensions: {
      width: 140,
      height: 100,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art6/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-7',
    title: {
      en: 'Chromatic Field I',
      de: 'Chromatisches Feld I',
      pl: 'Pole chromatyczne I'
    },
    slug: {
      _type: 'slug',
      current: 'chromatic-field-i'
    },
    year: 2022,
    medium: {
      en: 'Acrylic on canvas',
      de: 'Acryl auf Leinwand',
      pl: 'Akryl na płótnie'
    },
    dimensions: {
      width: 150,
      height: 150,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art7/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: true
  },
  {
    _id: 'artwork-8',
    title: {
      en: 'Structural Composition',
      de: 'Strukturelle Komposition',
      pl: 'Kompozycja strukturalna'
    },
    slug: {
      _type: 'slug',
      current: 'structural-composition'
    },
    year: 2022,
    medium: {
      en: 'Mixed media',
      de: 'Mischtechnik',
      pl: 'Technika mieszana'
    },
    dimensions: {
      width: 80,
      height: 80,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art8/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-9',
    title: {
      en: 'Ethereal Spaces',
      de: 'Ätherische Räume',
      pl: 'Przestrzenie eteryczne'
    },
    slug: {
      _type: 'slug',
      current: 'ethereal-spaces'
    },
    year: 2021,
    medium: {
      en: 'Watercolor on paper',
      de: 'Aquarell auf Papier',
      pl: 'Akwarela na papierze'
    },
    dimensions: {
      width: 60,
      height: 80,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art9/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-10',
    title: {
      en: 'Abstract Landscape',
      de: 'Abstrakte Landschaft',
      pl: 'Abstrakcyjny krajobraz'
    },
    slug: {
      _type: 'slug',
      current: 'abstract-landscape'
    },
    year: 2021,
    medium: {
      en: 'Oil on canvas',
      de: 'Öl auf Leinwand',
      pl: 'Olej na płótnie'
    },
    dimensions: {
      width: 120,
      height: 90,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art10/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-11',
    title: {
      en: 'Geometric Harmony',
      de: 'Geometrische Harmonie',
      pl: 'Harmonia geometryczna'
    },
    slug: {
      _type: 'slug',
      current: 'geometric-harmony'
    },
    year: 2021,
    medium: {
      en: 'Digital print',
      de: 'Digitaldruck',
      pl: 'Wydruk cyfrowy'
    },
    dimensions: {
      width: 70,
      height: 70,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art11/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  },
  {
    _id: 'artwork-12',
    title: {
      en: 'Night Study',
      de: 'Nachtstudie',
      pl: 'Studium nocne'
    },
    slug: {
      _type: 'slug',
      current: 'night-study'
    },
    year: 2020,
    medium: {
      en: 'Charcoal on paper',
      de: 'Kohle auf Papier',
      pl: 'Węgiel na papierze'
    },
    dimensions: {
      width: 50,
      height: 65,
      unit: 'cm'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/art12/800/800',
        _type: 'reference'
      }
    },
    images: [],
    featured: false
  }
];

/**
 * Mock Exhibitions for Development/Preview
 *
 * Comprehensive exhibition history (2015-2024) with varied types and venues.
 * Replace these with real Sanity content once CMS is populated.
 */
export const mockExhibitions: Exhibition[] = [
  {
    _id: 'exhibition-1',
    slug: {
      _type: 'slug',
      current: 'temporal-boundaries-2024'
    },
    title: {
      en: 'Temporal Boundaries',
      de: 'Zeitliche Grenzen',
      pl: 'Granice Czasowe'
    },
    year: 2024,
    startDate: '2024-09-15',
    endDate: '2024-11-30',
    type: 'solo',
    venue: {
      name: {
        en: 'Contemporary Art Museum',
        de: 'Museum für Zeitgenössische Kunst',
        pl: 'Muzeum Sztuki Współczesnej'
      },
      city: 'Berlin',
      country: 'Germany'
    },
    description: {
      en: 'A comprehensive solo exhibition exploring temporal perception through multimedia installations and video art.',
      de: 'Eine umfassende Einzelausstellung zur zeitlichen Wahrnehmung durch multimediale Installationen und Videokunst.',
      pl: 'Kompleksowa wystawa indywidualna badająca percepcję czasu poprzez instalacje multimedialne i sztukę wideo.'
    },
    featuredArtworks: ['artwork-1', 'artwork-3', 'artwork-7'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh1/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh1-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh1-install2/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh1-install3/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh1-install4/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-2',
    slug: {
      _type: 'slug',
      current: 'chromatic-fields-2024'
    },
    title: {
      en: 'Chromatic Fields',
      de: 'Chromatische Felder',
      pl: 'Pola Chromatyczne'
    },
    year: 2024,
    startDate: '2024-05-10',
    endDate: '2024-07-20',
    type: 'group',
    venue: {
      name: {
        en: 'Galerie Moderne',
        de: 'Galerie Moderne',
        pl: 'Galerie Moderne'
      },
      city: 'Paris',
      country: 'France'
    },
    description: {
      en: 'Group exhibition featuring contemporary approaches to color field painting.',
      de: 'Gruppenausstellung mit zeitgenössischen Ansätzen zur Farbfeldmalerei.',
      pl: 'Wystawa zbiorowa prezentująca współczesne podejścia do malarstwa pól barwnych.'
    },
    featuredArtworks: ['artwork-7'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh2/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh2-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh2-install2/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh2-install3/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-3',
    slug: {
      _type: 'slug',
      current: 'digital-landscapes-2023'
    },
    title: {
      en: 'Digital Landscapes',
      de: 'Digitale Landschaften',
      pl: 'Cyfrowe Krajobrazy'
    },
    year: 2023,
    startDate: '2023-10-05',
    endDate: '2024-01-15',
    type: 'institutional',
    venue: {
      name: {
        en: 'Tate Modern',
        de: 'Tate Modern',
        pl: 'Tate Modern'
      },
      city: 'London',
      country: 'United Kingdom'
    },
    description: {
      en: 'Major institutional exhibition examining the intersection of digital technology and contemporary art practice.',
      de: 'Große institutionelle Ausstellung zur Schnittstelle von digitaler Technologie und zeitgenössischer Kunstpraxis.',
      pl: 'Główna wystawa instytucjonalna badająca przecięcie technologii cyfrowej i współczesnej praktyki artystycznej.'
    },
    featuredArtworks: ['artwork-3', 'artwork-11'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh3/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh3-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh3-install2/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh3-install3/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh3-install4/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh3-install5/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-4',
    slug: {
      _type: 'slug',
      current: 'structural-visions-2023'
    },
    title: {
      en: 'Structural Visions',
      de: 'Strukturelle Visionen',
      pl: 'Wizje Strukturalne'
    },
    year: 2023,
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    type: 'solo',
    venue: {
      name: {
        en: 'Kunsthalle Basel',
        de: 'Kunsthalle Basel',
        pl: 'Kunsthalle Basel'
      },
      city: 'Basel',
      country: 'Switzerland'
    },
    description: {
      en: 'Solo exhibition focusing on geometric abstraction and spatial composition.',
      de: 'Einzelausstellung mit Schwerpunkt auf geometrischer Abstraktion und räumlicher Komposition.',
      pl: 'Wystawa indywidualna koncentrująca się na abstrakcji geometrycznej i kompozycji przestrzennej.'
    },
    featuredArtworks: ['artwork-4', 'artwork-8', 'artwork-11'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh4/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh4-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh4-install2/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh4-install3/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-5',
    slug: {
      _type: 'slug',
      current: 'urban-rhythms-2022'
    },
    title: {
      en: 'Urban Rhythms',
      de: 'Urbane Rhythmen',
      pl: 'Rytmy Miejskie'
    },
    year: 2022,
    startDate: '2022-11-12',
    endDate: '2023-02-05',
    type: 'group',
    venue: {
      name: {
        en: 'Museum of Modern Art',
        de: 'Museum für Moderne Kunst',
        pl: 'Muzeum Sztuki Nowoczesnej'
      },
      city: 'Warsaw',
      country: 'Poland'
    },
    description: {
      en: 'Group exhibition exploring urban environments through contemporary artistic practices.',
      de: 'Gruppenausstellung zur Erkundung urbaner Umgebungen durch zeitgenössische künstlerische Praktiken.',
      pl: 'Wystawa zbiorowa badająca środowiska miejskie poprzez współczesne praktyki artystyczne.'
    },
    featuredArtworks: ['artwork-6'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh5/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh5-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh5-install2/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-6',
    slug: {
      _type: 'slug',
      current: 'monochrome-studies-2022'
    },
    title: {
      en: 'Monochrome Studies',
      de: 'Monochrome Studien',
      pl: 'Studia Monochromatyczne'
    },
    year: 2022,
    startDate: '2022-04-20',
    endDate: '2022-07-15',
    type: 'solo',
    venue: {
      name: {
        en: 'Galeria Stereo',
        de: 'Galeria Stereo',
        pl: 'Galeria Stereo'
      },
      city: 'Poznan',
      country: 'Poland'
    },
    description: {
      en: 'Intimate solo exhibition featuring recent works on paper and canvas exploring monochromatic palettes.',
      de: 'Intime Einzelausstellung mit aktuellen Arbeiten auf Papier und Leinwand zur Erkundung monochromatischer Paletten.',
      pl: 'Kameralna wystawa indywidualna prezentująca najnowsze prace na papierze i płótnie badające palety monochromatyczne.'
    },
    featuredArtworks: ['artwork-5', 'artwork-12'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh6/1200/800',
        _type: 'reference'
      }
    },
    images: [
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh6-install1/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh6-install2/1600/1000',
          _type: 'reference'
        }
      },
      {
        _type: 'image',
        asset: {
          _ref: 'https://picsum.photos/seed/exh6-install3/1600/1000',
          _type: 'reference'
        }
      }
    ]
  },
  {
    _id: 'exhibition-7',
    slug: {
      _type: 'slug',
      current: 'european-perspectives-2021'
    },
    title: {
      en: 'European Perspectives',
      de: 'Europäische Perspektiven',
      pl: 'Perspektywy Europejskie'
    },
    year: 2021,
    startDate: '2021-09-15',
    endDate: '2021-12-20',
    type: 'group',
    venue: {
      name: {
        en: 'Stedelijk Museum',
        de: 'Stedelijk Museum',
        pl: 'Stedelijk Museum'
      },
      city: 'Amsterdam',
      country: 'Netherlands'
    },
    description: {
      en: 'International group exhibition showcasing emerging European artists.',
      de: 'Internationale Gruppenausstellung mit aufstrebenden europäischen Künstlern.',
      pl: 'Międzynarodowa wystawa zbiorowa prezentująca wschodzących europejskich artystów.'
    },
    featuredArtworks: ['artwork-9', 'artwork-10'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh7/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-8',
    slug: {
      _type: 'slug',
      current: 'landscape-memory-2021'
    },
    title: {
      en: 'Landscape Memory',
      de: 'Landschaftserinnerung',
      pl: 'Pamięć Krajobrazu'
    },
    year: 2021,
    startDate: '2021-03-10',
    endDate: '2021-06-05',
    type: 'solo',
    venue: {
      name: {
        en: 'Galerie Thomas Schulte',
        de: 'Galerie Thomas Schulte',
        pl: 'Galerie Thomas Schulte'
      },
      city: 'Berlin',
      country: 'Germany'
    },
    description: {
      en: 'Solo exhibition exploring themes of memory, place, and landscape through mixed media works.',
      de: 'Einzelausstellung zur Erkundung von Themen wie Erinnerung, Ort und Landschaft durch Mixed-Media-Arbeiten.',
      pl: 'Wystawa indywidualna badająca tematy pamięci, miejsca i krajobrazu poprzez prace w technice mieszanej.'
    },
    featuredArtworks: ['artwork-9', 'artwork-10'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh8/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-9',
    slug: {
      _type: 'slug',
      current: 'temporal-forms-2020'
    },
    title: {
      en: 'Temporal Forms',
      de: 'Zeitliche Formen',
      pl: 'Formy Czasowe'
    },
    year: 2020,
    startDate: '2020-10-01',
    endDate: '2021-01-10',
    type: 'group',
    venue: {
      name: {
        en: 'Centre Pompidou',
        de: 'Centre Pompidou',
        pl: 'Centre Pompidou'
      },
      city: 'Paris',
      country: 'France'
    },
    description: {
      en: 'Major group exhibition examining temporal dimensions in contemporary art.',
      de: 'Große Gruppenausstellung zur Untersuchung zeitlicher Dimensionen in der zeitgenössischen Kunst.',
      pl: 'Główna wystawa zbiorowa badająca wymiary czasowe w sztuce współczesnej.'
    },
    featuredArtworks: ['artwork-4', 'artwork-12'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh9/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-10',
    slug: {
      _type: 'slug',
      current: 'abstract-territories-2019'
    },
    title: {
      en: 'Abstract Territories',
      de: 'Abstrakte Territorien',
      pl: 'Terytoria Abstrakcyjne'
    },
    year: 2019,
    startDate: '2019-05-15',
    endDate: '2019-08-30',
    type: 'solo',
    venue: {
      name: {
        en: 'Zacheta National Gallery',
        de: 'Zacheta Nationalgalerie',
        pl: 'Zachęta Narodowa Galeria Sztuki'
      },
      city: 'Warsaw',
      country: 'Poland'
    },
    description: {
      en: 'Mid-career retrospective featuring works from 2015-2019.',
      de: 'Retrospektive der mittleren Karriere mit Werken von 2015-2019.',
      pl: 'Retrospektywa kariery artysty prezentująca prace z lat 2015-2019.'
    },
    featuredArtworks: ['artwork-6', 'artwork-7', 'artwork-8'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh10/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-11',
    slug: {
      _type: 'slug',
      current: 'color-space-2018'
    },
    title: {
      en: 'Color/Space',
      de: 'Farbe/Raum',
      pl: 'Kolor/Przestrzeń'
    },
    year: 2018,
    startDate: '2018-11-01',
    endDate: '2019-02-15',
    type: 'group',
    venue: {
      name: {
        en: 'Kunstmuseum Bonn',
        de: 'Kunstmuseum Bonn',
        pl: 'Kunstmuseum Bonn'
      },
      city: 'Bonn',
      country: 'Germany'
    },
    description: {
      en: 'Group exhibition investigating relationships between color theory and spatial perception.',
      de: 'Gruppenausstellung zur Untersuchung der Beziehungen zwischen Farbtheorie und räumlicher Wahrnehmung.',
      pl: 'Wystawa zbiorowa badająca relacje między teorią koloru a percepcją przestrzeni.'
    },
    featuredArtworks: ['artwork-7'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh11/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-12',
    slug: {
      _type: 'slug',
      current: 'new-geometries-2017'
    },
    title: {
      en: 'New Geometries',
      de: 'Neue Geometrien',
      pl: 'Nowe Geometrie'
    },
    year: 2017,
    startDate: '2017-06-20',
    endDate: '2017-09-10',
    type: 'group',
    venue: {
      name: {
        en: 'Kunsthalle Wien',
        de: 'Kunsthalle Wien',
        pl: 'Kunsthalle Wien'
      },
      city: 'Vienna',
      country: 'Austria'
    },
    description: {
      en: 'Contemporary takes on geometric abstraction from emerging European artists.',
      de: 'Zeitgenössische Ansätze zur geometrischen Abstraktion von aufstrebenden europäischen Künstlern.',
      pl: 'Współczesne ujęcia abstrakcji geometrycznej od wschodzących europejskich artystów.'
    },
    featuredArtworks: ['artwork-8', 'artwork-11'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh12/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-13',
    slug: {
      _type: 'slug',
      current: 'early-works-2016'
    },
    title: {
      en: 'Early Works',
      de: 'Frühe Arbeiten',
      pl: 'Wczesne Prace'
    },
    year: 2016,
    startDate: '2016-09-05',
    endDate: '2016-11-20',
    type: 'solo',
    venue: {
      name: {
        en: 'Galeria Leto',
        de: 'Galeria Leto',
        pl: 'Galeria Leto'
      },
      city: 'Warsaw',
      country: 'Poland'
    },
    description: {
      en: 'First major solo exhibition presenting foundational works and early experiments.',
      de: 'Erste große Einzelausstellung mit grundlegenden Werken und frühen Experimenten.',
      pl: 'Pierwsza duża wystawa indywidualna prezentująca fundamentalne prace i wczesne eksperymenty.'
    },
    featuredArtworks: ['artwork-10', 'artwork-12'],
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh13/1200/800',
        _type: 'reference'
      }
    }
  },
  {
    _id: 'exhibition-14',
    slug: {
      _type: 'slug',
      current: 'emerging-voices-2015'
    },
    title: {
      en: 'Emerging Voices',
      de: 'Aufkommende Stimmen',
      pl: 'Wschodzące Głosy'
    },
    year: 2015,
    startDate: '2015-03-10',
    endDate: '2015-06-15',
    type: 'group',
    venue: {
      name: {
        en: 'Arsenal Gallery',
        de: 'Arsenal Galerie',
        pl: 'Galeria Arsenal'
      },
      city: 'Bialystok',
      country: 'Poland'
    },
    description: {
      en: 'Group exhibition featuring recent graduates from Polish art academies.',
      de: 'Gruppenausstellung mit aktuellen Absolventen polnischer Kunstakademien.',
      pl: 'Wystawa zbiorowa prezentująca świeżych absolwentów polskich akademii sztuk pięknych.'
    },
    mainImage: {
      _type: 'image',
      asset: {
        _ref: 'https://picsum.photos/seed/exh14/1200/800',
        _type: 'reference'
      }
    }
  }
];
