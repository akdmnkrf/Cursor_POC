export type LatLng = {
  lat: number;
  lng: number;
};

export type HexCellMetrics = {
  hexId: string;
  resolution: number;
  centroid: LatLng;
  orderCount: number;
  cpEstimation: number;
  province: string;
};
