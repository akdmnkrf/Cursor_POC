"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="loading">Loading map...</div>,
});

export default function HomePage() {
  return <LeafletMap />;
}
