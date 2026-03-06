import { PROVINCES } from "@/lib/provinceConfig";

function pointInBounds(
  lat: number,
  lng: number,
  bounds: [[number, number], [number, number]],
): boolean {
  const [[south, west], [north, east]] = bounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

function boundsArea(bounds: [[number, number], [number, number]]): number {
  const [[south, west], [north, east]] = bounds;
  return (north - south) * (east - west);
}

export function getProvinceFromCentroid(lat: number, lng: number): string {
  const matches = PROVINCES.filter((province) => pointInBounds(lat, lng, province.bounds));

  if (matches.length === 0) {
    return "Unknown";
  }

  matches.sort((left, right) => boundsArea(left.bounds) - boundsArea(right.bounds));
  return matches[0].name;
}
