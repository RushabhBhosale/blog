import type { Metadata } from "next";
import TravelStoriesPage from "./TravelStoriesPage";
import { travelStories } from "@/lib/travelStories";

export const metadata: Metadata = {
  title: "My Travel Stories – Tailored Trip Journals & Itineraries",
  description:
    "Dive into bespoke travel itineraries, photo journals, and signature moments from Rushabh's adventures around the world. Each trip is designed with its own mood and layout.",
};

export default function Page() {
  return <TravelStoriesPage stories={travelStories} />;
}
