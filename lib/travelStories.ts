export type TravelStoryLayout = "coastal" | "zen" | "expedition";

export type TravelStoryItineraryItem = {
  dayLabel: string;
  title: string;
  description: string;
  highlights?: string[];
};

export type TravelStoryHighlight = {
  title: string;
  description: string;
  accent?: string;
};

export type TravelStoryGalleryImage = {
  src: string;
  alt: string;
  emphasis?: "wide" | "tall" | "square";
};

export type TravelStorySignatureMoment = {
  heading: string;
  description: string;
  image?: string;
  layout?: "left" | "right" | "full";
};

export type TravelStoryTheme = {
  layout: TravelStoryLayout;
  heroBackground: string;
  accentGradient: string;
  accentText: string;
  cardBackground: string;
  border: string;
  galleryShape: string;
  chipBackground: string;
  chipText: string;
};

export type TravelStory = {
  slug: string;
  title: string;
  location: string;
  dateRange: string;
  intro: string;
  coverImage: string;
  coverImageAlt: string;
  heroQuote: {
    text: string;
    attribution: string;
  };
  quickFacts: { label: string; value: string }[];
  highlights: TravelStoryHighlight[];
  itinerary: TravelStoryItineraryItem[];
  signatureMoments: TravelStorySignatureMoment[];
  gallery: TravelStoryGalleryImage[];
  theme: TravelStoryTheme;
};

export const travelStoryThemes: Record<TravelStoryLayout, TravelStoryTheme> = {
  coastal: {
    layout: "coastal",
    heroBackground: "bg-gradient-to-br from-sky-50 via-white to-cyan-200",
    accentGradient: "bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400",
    accentText: "text-sky-950",
    cardBackground: "bg-white shadow-sm",
    border: "border-sky-200",
    galleryShape: "rounded-[2.5rem]",
    chipBackground: "bg-cyan-50",
    chipText: "text-sky-800",
  },
  zen: {
    layout: "zen",
    heroBackground: "bg-gradient-to-br from-emerald-50 via-white to-lime-200",
    accentGradient:
      "bg-gradient-to-r from-emerald-300 via-lime-300 to-teal-400",
    accentText: "text-emerald-900",
    cardBackground: "bg-white shadow-sm",
    border: "border-emerald-200",
    galleryShape: "rounded-[3rem]",
    chipBackground: "bg-lime-50",
    chipText: "text-emerald-700",
  },
  expedition: {
    layout: "expedition",
    heroBackground:
      "bg-gradient-to-br from-orange-50 via-white to-amber-200",
    accentGradient:
      "bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400",
    accentText: "text-amber-900",
    cardBackground: "bg-white shadow-sm",
    border: "border-amber-200",
    galleryShape: "rounded-[2.75rem]",
    chipBackground: "bg-amber-50",
    chipText: "text-amber-700",
  },
};

export const travelStories: TravelStory[] = [
  {
    slug: "aegean-sunsets-santorini",
    title: "Aegean Sunsets & Cycladic Charm",
    location: "Santorini, Greece",
    dateRange: "May 2024",
    intro:
      "A five-day escape perched along Santorini's volcanic caldera, chasing cotton candy sunsets, village-to-village hikes, and the island's freshest flavors.",
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Sunset over white and blue domed buildings in Santorini",
    heroQuote: {
      text: "Every cliffside corner felt like a painted postcard waiting to be mailed home.",
      attribution: "Journal entry – Day 3, Oia",
    },
    quickFacts: [
      { label: "Base", value: "Fira Old Town" },
      { label: "Travel Crew", value: "Rushabh + 2 best friends" },
      { label: "Trip Focus", value: "Slow mornings & golden-hour adventures" },
    ],
    highlights: [
      {
        title: "Blue Dome Sunrise",
        description:
          "Claimed a quiet perch above the Three Bells of Fira at 6:10 am to watch pastel light wash the caldera.",
        accent: "Sunrise playlist: Yann Tiersen & local church bells",
      },
      {
        title: "Caldera Sailing",
        description:
          "A catamaran day cruise with hidden hot springs and grilled seafood onboard as the sky went tangerine.",
      },
      {
        title: "Wine Cave Dinner",
        description:
          "Seven-course tasting inside an 18th-century cave winery. Favorite pairing: Assyrtiko with tomato keftedes.",
      },
    ],
    itinerary: [
      {
        dayLabel: "Day 1",
        title: "Cliffside Check-In",
        description:
          "Arrived in Fira, settled into the cave suite, and wandered cobblestone alleys before a sunset dinner at Naoussa.",
        highlights: [
          "Sunset table overlooking the caldera",
          "Local dessert: galaktoboureko",
        ],
      },
      {
        dayLabel: "Day 2",
        title: "Hike Fira → Oia",
        description:
          "Four-hour coastal hike with breezy pauses in Imerovigli. Rewarded ourselves with homemade gelato at Lolita's.",
        highlights: [
          "Photographed Skaros Rock",
          "Gelato flavors: pistachio + lemon",
        ],
      },
      {
        dayLabel: "Day 3",
        title: "Sail the Caldera",
        description:
          "Catamaran cruise to Nea Kameni's hot springs and sunset swim near Amoudi Bay with a seafood grill onboard.",
        highlights: [
          "Jumped from the boat at golden hour",
          "Best bite: grilled octopus",
        ],
      },
      {
        dayLabel: "Day 4",
        title: "Megalochori & Wine",
        description:
          "Explored Megalochori's bougainvillea lanes, then wine tasting inside a candlelit cave cellar.",
        highlights: [
          "New favorite wine: Nykteri",
          "Paired with fava bean purée",
        ],
      },
      {
        dayLabel: "Day 5",
        title: "Volcanic Beach Day",
        description:
          "Relaxed on Perissa's black sands, paddle boarded, and wrapped the trip with a sunset from Oia Castle.",
        highlights: [
          "Collected smooth volcanic stones",
          "Farewell dinner: moussaka & baklava",
        ],
      },
    ],
    signatureMoments: [
      {
        heading: "Secret Sunrise Terrace",
        description:
          "A friendly cafe owner shared a hidden terrace above his rooftop. We watched the island wake up with freddo espressos in hand.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        layout: "left",
      },
      {
        heading: "Tomato Heaven",
        description:
          "Discovered that Santorini cherry tomatoes taste like sunshine. Joined a farm-to-table workshop and made the crispiest tomato fritters.",
        image:
          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1200&q=80",
        layout: "right",
      },
      {
        heading: "Postcard Hour in Oia",
        description:
          "Timed the sunset at the castle ruins, sketching the skyline instead of taking photos for a change.",
        image:
          "https://images.unsplash.com/photo-1506086679524-493c64fdfaa6?auto=format&fit=crop&w=1200&q=80",
        layout: "full",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
        alt: "Catamaran sailing along Santorini's caldera",
        emphasis: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
        alt: "Breakfast table with sea view",
        emphasis: "square",
      },
      {
        src: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=800&q=80",
        alt: "Santorini wine tasting setup",
        emphasis: "tall",
      },
      {
        src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
        alt: "Sunset over Oia",
        emphasis: "wide",
      },
    ],
    theme: travelStoryThemes.coastal,
  },
  {
    slug: "kyoto-temple-trails",
    title: "Kyoto's Lantern-Lit Autumn",
    location: "Kyoto, Japan",
    dateRange: "November 2023",
    intro:
      "Seven mindful days of tea ceremonies, moss gardens, and after-dark temple illuminations across Kyoto's old districts.",
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Autumn leaves framing a temple in Kyoto",
    heroQuote: {
      text: "Stillness in Kyoto is never silent — it's the hush of falling leaves and distant temple bells.",
      attribution: "Train ride notes – JR Nara Line",
    },
    quickFacts: [
      { label: "Stay", value: "Machiya townhouse in Gion" },
      { label: "Mood", value: "Unhurried, camera in hand" },
      { label: "Fuel", value: "Matcha, seasonal wagashi, noodle bars" },
    ],
    highlights: [
      {
        title: "Arashiyama Dawn",
        description:
          "Entered the bamboo grove before sunrise, catching the light beams with almost no crowd.",
        accent: "Soundtrack: rustling leaves + morning cicadas",
      },
      {
        title: "Tea with a Potter",
        description:
          "Intimate tea ceremony hosted by a fifth-generation ceramic artist in her studio loft.",
      },
      {
        title: "Temple Night Walk",
        description:
          "Kiyomizu-dera's autumn illumination with maple reflections shimmering in the Otowa waterfall.",
      },
    ],
    itinerary: [
      {
        dayLabel: "Day 1",
        title: "Gion Introductions",
        description:
          "Checked into the machiya, strolled Hanamikoji Street, and sampled seasonal kaiseki at Gion Tanto.",
        highlights: [
          "Spotted a maiko on evening rounds",
          "First taste of yudofu",
        ],
      },
      {
        dayLabel: "Day 2",
        title: "Arashiyama & Sagano",
        description:
          "Sunrise in the bamboo forest, then a scenic ride on the Sagano Romantic Train and river boat back.",
        highlights: ["Hozugawa River boat ride", "Sweet potato taiyaki"],
      },
      {
        dayLabel: "Day 3",
        title: "Temple Textures",
        description:
          "Explored Nanzen-ji's aqueduct, Honen-in's moss gardens, and the Philosopher's Path.",
        highlights: ["Tasted tofu soft serve", "Sketched the aqueduct arches"],
      },
      {
        dayLabel: "Day 4",
        title: "Craft & Tea",
        description:
          "Met with potter Junko-san for a private tea ceremony and pottery glazing workshop.",
        highlights: [
          "Hand-painted a tea cup",
          "Learned proper whisking technique",
        ],
      },
      {
        dayLabel: "Day 5",
        title: "Nara Day Trip",
        description:
          "Fed the bowing deer, climbed to Todaiji's giant Buddha, and sampled mochi pounded to order.",
        highlights: [
          "Sunset from Nara Park hill",
          "Freshly pounded kusa mochi",
        ],
      },
      {
        dayLabel: "Day 6",
        title: "Kyoto After Dark",
        description:
          "Lantern walk through Higashiyama, night visit to Kiyomizu-dera's light festival, and late ramen.",
        highlights: [
          "Bonus photo stop at Yasaka Pagoda",
          "Ramen bowl count: 3",
        ],
      },
      {
        dayLabel: "Day 7",
        title: "Slow Farewell",
        description:
          "Packed souvenirs, wrote postcards from a cafe in Nishiki Market, and took the Shinkansen to Tokyo.",
        highlights: ["Bought matcha kit", "Final treat: strawberry daifuku"],
      },
    ],
    signatureMoments: [
      {
        heading: "Tea Ceremony with Junko-san",
        description:
          "She taught us that the bowl should feel like a warm handshake. Left with clay on my sleeves and a new appreciation for quiet rituals.",
        image:
          "https://images.unsplash.com/photo-1506080174650-98fcb78b44b4?auto=format&fit=crop&w=1200&q=80",
        layout: "left",
      },
      {
        heading: "Lantern Glow in Higashiyama",
        description:
          "Walked the preserved streets under lantern light, the scent of incense and kinako wafting through narrow alleys.",
        image:
          "https://images.unsplash.com/photo-1459213599465-03ab6a4d5931?auto=format&fit=crop&w=1200&q=80",
        layout: "right",
      },
      {
        heading: "Philosopher's Path Reflections",
        description:
          "Spent an afternoon journaling beside the canal while red leaves floated past.",
        image:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        layout: "full",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1568084300946-2ba200057a03?auto=format&fit=crop&w=1200&q=80",
        alt: "Kyoto bamboo forest",
        emphasis: "tall",
      },
      {
        src: "https://images.unsplash.com/photo-1526481280695-3c5aa1fd1739?auto=format&fit=crop&w=1200&q=80",
        alt: "Tea ceremony setup",
        emphasis: "square",
      },
      {
        src: "https://images.unsplash.com/photo-1470753937643-efeb931202a9?auto=format&fit=crop&w=1200&q=80",
        alt: "Fushimi Inari shrine",
        emphasis: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1503448701467-9ca81f0b3597?auto=format&fit=crop&w=1200&q=80",
        alt: "Nara deer at sunset",
        emphasis: "wide",
      },
    ],
    theme: travelStoryThemes.zen,
  },
  {
    slug: "patagonia-basecamp-chile",
    title: "Windswept Patagonia Basecamp",
    location: "Torres del Paine, Chile",
    dateRange: "February 2023",
    intro:
      "A rugged expedition across Patagonia's granite towers and turquoise lakes, chasing condors by day and southern stars by night.",
    coverImage:
      "https://images.unsplash.com/photo-1548783307-f63adc78c5f6?auto=format&fit=crop&w=1600&q=80",
    coverImageAlt: "Hiker overlooking Torres del Paine",
    heroQuote: {
      text: "The wind roared like a jet engine, yet every sunrise softened the skyline in pastel blues.",
      attribution: "Camp journal – Torres Camp Italiano",
    },
    quickFacts: [
      { label: "Route", value: "W Trek + Grey Glacier extension" },
      { label: "Crew", value: "Rushabh + guide + 6 trekkers" },
      { label: "Essentials", value: "Layers, trekking poles, matte de coca" },
    ],
    highlights: [
      {
        title: "Base of the Towers",
        description:
          "4:30 am headlamp start to catch sunrise turning the towers fiery orange.",
        accent: "Wind gusts hit 70 km/h at the mirador",
      },
      {
        title: "Grey Glacier Kayak",
        description:
          "Paddled past floating blue icebergs with calving thunder echoing across the water.",
      },
      {
        title: "Milky Way Bonfire",
        description:
          "Starry sky photography workshop followed by sharing stories around the campfire.",
      },
    ],
    itinerary: [
      {
        dayLabel: "Day 1",
        title: "Basecamp Briefings",
        description:
          "Arrival in Puerto Natales, gear check, and first taste of king crab empanadas.",
        highlights: ["Met trekking team", "Sunset stroll along the fjord"],
      },
      {
        dayLabel: "Day 2",
        title: "Torres Ascent",
        description:
          "Tough climb to the Torres base with glacial lagoon picnic and frosty toes.",
        highlights: ["70 km/h winds", "Lagoon dip (very brief)"],
      },
      {
        dayLabel: "Day 3",
        title: "Valle del Francés",
        description:
          "Crossed hanging bridges with views of Paine Grande avalanches rumbling in the distance.",
        highlights: ["Avalanche spotting", "Mate tea under lenga trees"],
      },
      {
        dayLabel: "Day 4",
        title: "Grey Glacier",
        description:
          "Kayaked around electric blue icebergs and trekked across crevasse fields with crampons.",
        highlights: [
          "Sipped whisky with glacier ice",
          "Witnessed a calving wall",
        ],
      },
      {
        dayLabel: "Day 5",
        title: "Paine Grande to Pueblo",
        description:
          "Boat across Lago Pehoé, farewell asado, and stargazing bonfire.",
        highlights: ["Milky Way in full glow", "Shared stories with gauchos"],
      },
    ],
    signatureMoments: [
      {
        heading: "Glacier Blue Hour",
        description:
          "The ice glowed neon as clouds rolled in. The guide had us sit in silence for 5 minutes — pure, icy magic.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        layout: "left",
      },
      {
        heading: "Camp Conversations",
        description:
          "Ended most days trading trek stories under a tarp while the wind howled like distant thunder.",
        image:
          "https://images.unsplash.com/photo-1458442310124-dde6edb43d10?auto=format&fit=crop&w=1200&q=80",
        layout: "right",
      },
      {
        heading: "Summit Silence",
        description:
          "The moment the towers lit up in burnt orange, everyone fell silent. Pure awe.",
        image:
          "https://images.unsplash.com/photo-1493815793585-d94ccbc86df0?auto=format&fit=crop&w=1200&q=80",
        layout: "full",
      },
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df0?auto=format&fit=crop&w=1200&q=80",
        alt: "Sunrise hitting Torres del Paine",
        emphasis: "wide",
      },
      {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        alt: "Backpacker on trail",
        emphasis: "tall",
      },
      {
        src: "https://images.unsplash.com/photo-1516570161787-2fd917215a3d?auto=format&fit=crop&w=1200&q=80",
        alt: "Glacier kayaking",
        emphasis: "square",
      },
      {
        src: "https://images.unsplash.com/photo-1517256064527-09c73fc73e41?auto=format&fit=crop&w=1200&q=80",
        alt: "Night sky over camp",
        emphasis: "wide",
      },
    ],
    theme: travelStoryThemes.expedition,
  },
];
