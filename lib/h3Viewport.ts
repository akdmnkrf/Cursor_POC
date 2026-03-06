import { cellToBoundary, cellToLatLng, latLngToCell } from "h3-js";

export const FIXED_H3_RESOLUTION = 9;
const MAX_RENDERED_HEXES = 1400;

export type ViewportBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

function toLatLngRing(bounds: ViewportBounds): number[][] {
  return [
    [bounds.south, bounds.west],
    [bounds.south, bounds.east],
    [bounds.north, bounds.east],
    [bounds.north, bounds.west],
    [bounds.south, bounds.west],
  ];
}

function sampleHexes(hexIds: string[], maxCount: number): string[] {
  if (hexIds.length <= maxCount) {
    return hexIds;
  }

  const sorted = [...hexIds].sort();
  const step = Math.ceil(sorted.length / maxCount);

  return sorted.filter((_, index) => index % step === 0).slice(0, maxCount);
}

export function getVisibleHexIds(bounds: ViewportBounds): string[] {
  const ring = toLatLngRing(bounds);
  const south = ring[0][0];
  const west = ring[0][1];
  const north = ring[2][0];
  const east = ring[2][1];

  const latSpan = Math.max(north - south, 0.01);
  const lngSpan = Math.max(east - west, 0.01);
  const aspect = lngSpan / latSpan;
  const rowCount = Math.max(18, Math.round(Math.sqrt(MAX_RENDERED_HEXES / Math.max(aspect, 0.35))));
  const colCount = Math.max(18, Math.round(rowCount * aspect));

  const hexIds = new Set<string>();
  const latStep = latSpan / rowCount;
  const lngStep = lngSpan / colCount;

  for (let row = 0; row <= rowCount; row += 1) {
    const lat = south + row * latStep;
    for (let col = 0; col <= colCount; col += 1) {
      const lng = west + col * lngStep;
      hexIds.add(latLngToCell(lat, lng, FIXED_H3_RESOLUTION));
    }
  }

  return sampleHexes(Array.from(hexIds), MAX_RENDERED_HEXES);
}

export function getHexBoundary(hexId: string): [number, number][] {
  const boundary = cellToBoundary(hexId) as number[][];
  return boundary.map(([lat, lng]) => [lat, lng]);
}

export function getHexCentroid(hexId: string): { lat: number; lng: number } {
  const [lat, lng] = cellToLatLng(hexId);
  return { lat, lng };
}
