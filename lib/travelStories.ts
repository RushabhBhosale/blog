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
  alt?: string;
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
    heroBackground: "bg-gradient-to-br from-orange-50 via-white to-amber-200",
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
    slug: "nainital-jim-corbett",
    title: "Nainital & Jim Corbett",
    location: "Nainital, Uttarakhand",
    dateRange: "Feb 2023",
    intro:
      "A six day college trip to Nainital, Jim corbetts jungle safari, boat ride in the Nainital lake, snow view by cable car, shopping at mall road",
    coverImage: "/trip/nainital/nainital.jpeg",
    coverImageAlt: "Sunset over white and blue domed buildings in Santorini",
    heroQuote: {
      text: "Every cliffside corner felt like a painted postcard waiting to be mailed home.",
      attribution: "Journal entry – Day 3, Oia",
    },
    quickFacts: [
      { label: "Base", value: "Rudrapur, Nainital & Corbett" },
      { label: "Travel Crew", value: "Khalsa College Students" },
      { label: "Trip Focus", value: "Adventure, Nature & College Memories" },
    ],
    highlights: [
      {
        title: "Boating at Naini Lake",
        description:
          "Tranquil morning boat rides surrounded by mist-covered hills and reflections of the old temples around the lake.",
        accent: "Perfect start to Nainital mornings",
      },
      {
        title: "Snow View by Cable Car",
        description:
          "An aerial ride to witness snow-capped Himalayan peaks — followed by local shopping at Mall Road and Bhotia Market.",
      },
      {
        title: "Jim Corbett Jungle Safari",
        description:
          "A thrilling open-gypsy safari through the dense forests of Corbett, spotting deer, elephants, and exotic birds.",
      },
    ],
    itinerary: [
      {
        dayLabel: "Day 1",
        title: "Departure from Mumbai",
        description:
          "Reported at Mumbai Central by 3:00 PM and boarded the Tejas Rajdhani Express for Delhi. Overnight train journey filled with anticipation and college chatter.",
        highlights: [
          "Train: 12953 Tejas Rajdhani Express",
          "Departure: 5:10 PM from Mumbai Central",
        ],
      },
      {
        dayLabel: "Day 2",
        title: "Delhi to Rudrapur",
        description:
          "Arrived in Delhi and continued the journey by bus to Rudrapur with a pit stop for lunch at Shiva Dhaba, Garh-Mukteshwar. Checked into Sonia Resort by afternoon and relaxed through the evening.",
        highlights: ["Lunch at Shiva Dhaba", "Evening at Sonia Resort"],
      },
      {
        dayLabel: "Day 3",
        title: "Industrial Visit & Nainital Arrival",
        description:
          "Morning industrial visit followed by a scenic 2-hour drive to Nainital. Checked into the hotel, enjoyed music and dinner with the group.",
        highlights: ["Industrial visit near Rudrapur", "DJ night at Nainital"],
      },
      {
        dayLabel: "Day 4",
        title: "Exploring Nainital",
        description:
          "Started with a peaceful boating session on Naini Lake, rode the cable car to Snow View Point, and ended the day shopping at Mall Road and Bhotia Market.",
        highlights: [
          "Boating at Naini Lake",
          "Snow View by cable car",
          "Shopping spree at Mall Road",
        ],
      },
      {
        dayLabel: "Day 5",
        title: "Drive to Jim Corbett",
        description:
          "Morning drive from Nainital to Corbett Park. After lunch, embarked on a jungle safari — an unforgettable adventure through the forest trails.",
        highlights: ["Check-in at Samsara Resort", "Evening jungle safari"],
      },
      {
        dayLabel: "Day 6",
        title: "Return Journey Begins",
        description:
          "Early breakfast and departure for Delhi. Lunch stop at Shiva Dhaba, then boarded the Sampark Kranti Express for Mumbai.",
        highlights: [
          "Train: 12908 Sampark Kranti Express",
          "Departure: 4:30 PM from Delhi",
        ],
      },
      {
        dayLabel: "Day 7",
        title: "Arrival in Mumbai",
        description:
          "Breakfast and lunch aboard the train before reaching Mumbai by 9:00 AM — trip concluded with stories, laughter, and hundreds of photos.",
        highlights: ["Arrival: 9:00 AM at Mumbai Central"],
      },
    ],
    signatureMoments: [
      {
        heading: "Evening at Mall Road",
        description:
          "The group wandered through cozy cafés and souvenir shops as the town lit up with warm yellow streetlights reflecting on the wet pavement.",
        image: "/trip/nainital/eve.jpeg",
        layout: "left",
      },
      {
        heading: "Safari Morning in Corbett",
        description:
          "The chill of dawn, jeep engines humming, and the thrill of spotting wildlife amidst fog-draped sal trees — pure adventure.",
        image: "/trip/nainital/safari.jpeg",
        layout: "right",
      },
      {
        heading: "Cable Car to the Clouds",
        description:
          "From the top of Snow View Point, the Himalayas stood like painted giants — a breathtaking view that silenced everyone for a moment.",
        image: "/trip/nainital/cable.jpg",
        layout: "full",
      },
    ],
    gallery: [
      {
        src: "/trip/nainital/gallery/1.jpeg",
        alt: "Nainital",
        emphasis: "wide",
      },
      {
        src: "/trip/nainital/gallery/2.jpeg",
        alt: "Nainital",
        emphasis: "square",
      },
      {
        src: "/trip/nainital/gallery/3.jpeg",
        alt: "Nainital",
        emphasis: "tall",
      },
      {
        src: "/trip/nainital/gallery/4.jpeg",
        alt: "Nainital",
        emphasis: "wide",
      },
      {
        src: "/trip/nainital/gallery/5.jpeg",
        alt: "Nainital",
        emphasis: "square",
      },
      {
        src: "/trip/nainital/gallery/6.jpeg",
        alt: "Nainital",
        emphasis: "tall",
      },
      {
        src: "/trip/nainital/gallery/7.jpeg",
        alt: "Nainital",
        emphasis: "wide",
      },
      {
        src: "/trip/nainital/gallery/8.jpeg",
        alt: "Nainital",
        emphasis: "square",
      },
      {
        src: "/trip/nainital/gallery/9.jpeg",
        alt: "Nainital",
        emphasis: "tall",
      },
      {
        src: "/trip/nainital/gallery/10.jpeg",
        alt: "Nainital",
        emphasis: "wide",
      },
      {
        src: "/trip/nainital/gallery/11.jpeg",
        alt: "Nainital",
        emphasis: "square",
      },
    ],

    theme: travelStoryThemes.coastal, // optionally replace with "expedition" for mountain feel
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
