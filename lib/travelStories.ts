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
    slug: "amritsar-vrindavan-mathura",
    title: "Amritsar & Mathura",
    location: "Punjab, Uttar Pradesh",
    dateRange: "January 2024",
    intro:
      "Started from the golden temple in Amritsar tasted the chole kulcha, and continued to the temples in mathura and vridavan.",
    coverImage: "/trip/amritsar/golden-temple.jpg",
    coverImageAlt: "Golden-temple",
    heroQuote: {
      text: "Stillness in Kyoto is never silent — it's the hush of falling leaves and distant temple bells.",
      attribution: "Train ride notes – JR Nara Line",
    },
    quickFacts: [
      {
        label: "Stay",
        value: "Heritage guesthouse near Golden Temple, Amritsar",
      },
      { label: "Mood", value: "Spiritual, food-loving, temple-hopping" },
      {
        label: "Fuel",
        value: "Chole kulcha, lassi, local sweets, street snacks",
      },
    ],
    highlights: [
      {
        title: "Golden Temple",
        description:
          "Witnessed the mesmerizing Golden Temple — despite the crowd, everything was perfectly managed, and the prasad (sheera) is an absolute must-try.",
      },
      {
        title: "Wagah Border",
        description:
          "Witnessed the thrilling Wagah Border ceremony — soldiers’ precision, patriotic fervor, and the lively crowd made it an unforgettable experience.",
      },
      {
        title: "Prem Mandir & Banke Bihari",
        description:
          "The lighting at Prem Mandir was stunning, illuminating every detail of the temple and creating a truly divine atmosphere.",
      },
      {
        title: "Shri Krishna Janmasthan",
        description:
          "Visited Lord Krishna’s birthplace in Mathura, surrounded by devotion, colorful decorations, and lively stories.",
      },
    ],
    itinerary: [
      {
        dayLabel: "Day 1",
        title: "Arrival in Amritsar",
        description:
          "Landed in Amritsar, checked into a guesthouse, and relaxed before the evening visit to the Golden Temple.",
        highlights: ["Evening aarti at Golden Temple", "Tried prasad (sheera)"],
      },
      {
        dayLabel: "Day 2",
        title: "Golden Temple & Local Flavors",
        description:
          "Explored the Golden Temple in the morning, walked around the Amrit Sarovar, and savored chole kulcha at a local eatery.",
        highlights: ["Morning prayers at the temple", "Street food tasting"],
      },
      {
        dayLabel: "Day 3",
        title: "Wagah Border Ceremony",
        description:
          "Visited the Wagah Border for the thrilling flag-lowering ceremony and soaked in the patriotic atmosphere.",
        highlights: [
          "Soldiers' parade precision",
          "Cheering crowds experience",
        ],
      },
      {
        dayLabel: "Day 4",
        title: "Travel to Mathura",
        description:
          "Traveled from Amritsar to Mathura, checked into a local stay, and explored the evening markets.",
        highlights: ["Local sweets tasting", "Evening temple stroll"],
      },
      {
        dayLabel: "Day 5",
        title: "Shri Krishna Janmasthan",
        description:
          "Visited Lord Krishna’s birthplace in Mathura, immersed in devotion, vibrant colors, and temple stories.",
        highlights: ["Temple rituals", "Photography of temple architecture"],
      },
      {
        dayLabel: "Day 6",
        title: "Prem Mandir & Banke Bihari",
        description:
          "Explored the illuminated Prem Mandir and experienced the divine energy at Banke Bihari Temple in Vrindavan.",
        highlights: ["Evening aarti", "Temple lighting photography"],
      },
      {
        dayLabel: "Day 7",
        title: "Vrindavan Temples",
        description:
          "Continued temple hopping in Vrindavan, exploring lesser-known shrines and local streets.",
        highlights: ["Interacted with locals", "Tasted street snacks"],
      },
      {
        dayLabel: "Day 8",
        title: "Return Home",
        description:
          "Wrapped up the trip, packed souvenirs, and traveled back home from Vrindavan via Mathura.",
        highlights: ["Bought local handicrafts", "Reflected on the journey"],
      },
    ],
    signatureMoments: [
      {
        heading: "Golden Temple",
        description: "A morning at the golden temple",
        image: "/trip/amritsar/gallery/1.jpg",
        layout: "left",
      },
    ],
    gallery: [
      {
        src: "/trip/amritsar/gallery/1.jpg",
        alt: "Amritsar trip photo",
        emphasis: "tall",
      },
      {
        src: "/trip/amritsar/gallery/2.jpg",
        alt: "Amritsar trip photo",
        emphasis: "square",
      },
      {
        src: "/trip/amritsar/gallery/3.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
      {
        src: "/trip/amritsar/gallery/4.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
      {
        src: "/trip/amritsar/gallery/5.jpg",
        alt: "Amritsar trip photo",
        emphasis: "tall",
      },
      {
        src: "/trip/amritsar/gallery/6.jpg",
        alt: "Amritsar trip photo",
        emphasis: "square",
      },
      {
        src: "/trip/amritsar/gallery/7.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
      {
        src: "/trip/amritsar/gallery/8.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
      {
        src: "/trip/amritsar/gallery/9.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
      {
        src: "/trip/amritsar/gallery/10.jpg",
        alt: "Amritsar trip photo",
        emphasis: "wide",
      },
    ],
    theme: travelStoryThemes.expedition,
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
