export type OrderBucket = {
  min: number;
  max: number;
  label: string;
  color: string;
};

export const ORDER_COUNT_BUCKETS: OrderBucket[] = [
  { min: 0, max: 99, label: "0-99", color: "#56B4E9" },
  { min: 100, max: 249, label: "100-249", color: "#0072B2" },
  { min: 250, max: 399, label: "250-399", color: "#00A6D6" },
  { min: 400, max: 599, label: "400-599", color: "#F0E442" },
  { min: 600, max: 799, label: "600-799", color: "#E69F00" },
  { min: 800, max: 1000, label: "800-1000", color: "#332288" },
];

export function getOrderColor(orderCount: number): string {
  const match = ORDER_COUNT_BUCKETS.find(
    (bucket) => orderCount >= bucket.min && orderCount <= bucket.max,
  );
  return match?.color ?? ORDER_COUNT_BUCKETS[ORDER_COUNT_BUCKETS.length - 1].color;
}
