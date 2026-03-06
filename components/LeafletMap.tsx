"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Polygon, Popup, TileLayer, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import type { LatLngBoundsExpression, LeafletMouseEvent } from "leaflet";
import { FIXED_H3_RESOLUTION, getHexBoundary, getHexCentroid, getVisibleHexIds } from "@/lib/h3Viewport";
import type { HexCellMetrics } from "@/lib/hexModel";
import { ORDER_COUNT_BUCKETS, getOrderColor } from "@/lib/metricScale";
import { getStableCpEstimation, getStableOrderCount } from "@/lib/mockHexMetrics";
import { ALL_TURKIYE_OPTION, PROVINCES, TURKIYE_BOUNDS, getProvinceByCode } from "@/lib/provinceConfig";
import { getProvinceFromCentroid } from "@/lib/provinceLookup";

type ViewportHexSyncProps = {
  selectedProvinceCode: string;
  onHexDataChange: (hexes: HexCellMetrics[]) => void;
};

type ViewportBounds = {
  south: number;
  west: number;
  north: number;
  east: number;
};

const DEFAULT_BOUNDS = TURKIYE_BOUNDS as LatLngBoundsExpression;

function clampToTurkiyeBounds(bounds: ViewportBounds): ViewportBounds {
  const [[countrySouth, countryWest], [countryNorth, countryEast]] = TURKIYE_BOUNDS;
  return {
    south: Math.max(bounds.south, countrySouth),
    west: Math.max(bounds.west, countryWest),
    north: Math.min(bounds.north, countryNorth),
    east: Math.min(bounds.east, countryEast),
  };
}

function buildHexMetrics(bounds: ViewportBounds): HexCellMetrics[] {
  const visibleHexIds = getVisibleHexIds(bounds);

  return visibleHexIds.map((hexId) => {
    const centroid = getHexCentroid(hexId);
    return {
      hexId,
      resolution: FIXED_H3_RESOLUTION,
      centroid,
      orderCount: getStableOrderCount(hexId),
      cpEstimation: getStableCpEstimation(hexId),
      province: getProvinceFromCentroid(centroid.lat, centroid.lng),
    };
  });
}

function ViewportHexSync({ selectedProvinceCode, onHexDataChange }: ViewportHexSyncProps) {
  const map = useMap();

  const refreshVisibleHexes = useCallback(() => {
    const bounds = map.getBounds();
    const viewport = clampToTurkiyeBounds({
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast(),
    });

    onHexDataChange(buildHexMetrics(viewport));
  }, [map, onHexDataChange]);

  useEffect(() => {
    const selectedProvince =
      selectedProvinceCode === ALL_TURKIYE_OPTION.code
        ? ALL_TURKIYE_OPTION
        : getProvinceByCode(selectedProvinceCode) ?? ALL_TURKIYE_OPTION;

    map.fitBounds(selectedProvince.bounds as LatLngBoundsExpression, {
      animate: false,
      padding: [24, 24],
      maxZoom: selectedProvince.code === ALL_TURKIYE_OPTION.code ? 7 : 10,
    });

    refreshVisibleHexes();
  }, [map, refreshVisibleHexes, selectedProvinceCode]);

  useMapEvents({
    moveend: refreshVisibleHexes,
    zoomend: refreshVisibleHexes,
  });

  return null;
}

export default function LeafletMap() {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>(ALL_TURKIYE_OPTION.code);
  const [searchText, setSearchText] = useState<string>("");
  const [visibleHexes, setVisibleHexes] = useState<HexCellMetrics[]>([]);
  const [activeHexId, setActiveHexId] = useState<string | null>(null);
  const [hoveredHexId, setHoveredHexId] = useState<string | null>(null);

  const filteredProvinces = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return PROVINCES;
    }

    return PROVINCES.filter((province) => province.name.toLowerCase().includes(normalizedSearch));
  }, [searchText]);

  const boundaryByHexId = useMemo(() => {
    const map = new Map<string, [number, number][]>();
    for (const hex of visibleHexes) {
      map.set(hex.hexId, getHexBoundary(hex.hexId));
    }
    return map;
  }, [visibleHexes]);

  const handleHexClick = (hexId: string) => (event: LeafletMouseEvent) => {
    event.originalEvent.stopPropagation();
    setActiveHexId(hexId);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        bounds={DEFAULT_BOUNDS}
        maxBounds={DEFAULT_BOUNDS}
        maxBoundsViscosity={1}
        minZoom={6}
        zoomControl={false}
        preferCanvas
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <ViewportHexSync selectedProvinceCode={selectedProvinceCode} onHexDataChange={setVisibleHexes} />

        {visibleHexes.map((hex) => {
          const boundary = boundaryByHexId.get(hex.hexId);
          if (!boundary) {
            return null;
          }

          const isActive = activeHexId === hex.hexId;
          const isHovered = hoveredHexId === hex.hexId;
          const fillColor = getOrderColor(hex.orderCount);

          return (
            <Polygon
              key={hex.hexId}
              positions={boundary}
              pathOptions={{
                color: isActive ? "#111827" : isHovered ? "#0f172a" : "#334155",
                fillColor,
                fillOpacity: 0.64,
                weight: isActive ? 2.4 : isHovered ? 1.8 : 0.9,
              }}
              eventHandlers={{
                click: handleHexClick(hex.hexId),
                mouseover: () => setHoveredHexId(hex.hexId),
                mouseout: () => setHoveredHexId((current) => (current === hex.hexId ? null : current)),
              }}
            >
              {isActive ? (
                <Popup position={[hex.centroid.lat, hex.centroid.lng]} closeButton>
                  <div style={{ minWidth: 260 }}>
                    <div>
                      <strong>Hex ID:</strong> {hex.hexId}
                    </div>
                    <div>
                      <strong>Resolution:</strong> {hex.resolution}
                    </div>
                    <div>
                      <strong>Province:</strong> {hex.province}
                    </div>
                    <div>
                      <strong>Order Count:</strong> {hex.orderCount}
                    </div>
                    <div>
                      <strong>CP Estimation:</strong> {hex.cpEstimation}
                    </div>
                    <div>
                      <strong>Centroid:</strong> {hex.centroid.lat.toFixed(5)}, {hex.centroid.lng.toFixed(5)}
                    </div>
                  </div>
                </Popup>
              ) : null}
            </Polygon>
          );
        })}
      </MapContainer>

      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "min(700px, calc(100vw - 36px))",
          borderRadius: 10,
          background: "rgba(255, 255, 255, 0.96)",
          boxShadow: "0 2px 12px rgba(15, 23, 42, 0.14)",
          padding: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          aria-label="Search province"
          placeholder="Search province..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          style={{
            width: "100%",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
          }}
        />

        <select
          aria-label="Select province"
          value={selectedProvinceCode}
          onChange={(event) => {
            setSelectedProvinceCode(event.target.value);
            setActiveHexId(null);
          }}
          style={{
            width: "100%",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            background: "#ffffff",
          }}
        >
          <option value={ALL_TURKIYE_OPTION.code}>{ALL_TURKIYE_OPTION.name}</option>
          {filteredProvinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 900,
          pointerEvents: "none",
          width: "min(880px, calc(100vw - 36px))",
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            borderRadius: 10,
            background: "rgba(255, 255, 255, 0.94)",
            boxShadow: "0 2px 10px rgba(15, 23, 42, 0.14)",
            padding: "8px 10px",
          }}
        >
          {ORDER_COUNT_BUCKETS.map((bucket) => (
            <div key={bucket.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 18,
                  height: 12,
                  display: "inline-block",
                  borderRadius: 3,
                  border: "1px solid rgba(15, 23, 42, 0.35)",
                  background: bucket.color,
                }}
              />
              <span style={{ fontSize: 12, color: "#1f2937" }}>{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
