export type LatLngTuple = [number, number];

export type ProvinceConfig = {
  code: string;
  name: string;
  bounds: [LatLngTuple, LatLngTuple];
};

type ProvinceSeed = {
  code: string;
  name: string;
  center: LatLngTuple;
  span?: [number, number];
};

export const TURKIYE_BOUNDS: [LatLngTuple, LatLngTuple] = [
  [35.8, 25.5],
  [42.2, 45.0],
];

export const ALL_TURKIYE_OPTION: ProvinceConfig = {
  code: "all",
  name: "All Turkiye",
  bounds: TURKIYE_BOUNDS,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toBounds(seed: ProvinceSeed): ProvinceConfig {
  const [lat, lng] = seed.center;
  const [latSpan, lngSpan] = seed.span ?? [0.42, 0.52];
  const [countrySouthWest, countryNorthEast] = TURKIYE_BOUNDS;

  const south = clamp(lat - latSpan, countrySouthWest[0], countryNorthEast[0]);
  const north = clamp(lat + latSpan, countrySouthWest[0], countryNorthEast[0]);
  const west = clamp(lng - lngSpan, countrySouthWest[1], countryNorthEast[1]);
  const east = clamp(lng + lngSpan, countrySouthWest[1], countryNorthEast[1]);

  return {
    code: seed.code,
    name: seed.name,
    bounds: [
      [south, west],
      [north, east],
    ],
  };
}

const provinceSeeds: ProvinceSeed[] = [
  { code: "adana", name: "Adana", center: [37.0017, 35.3289], span: [0.45, 0.55] },
  { code: "adiyaman", name: "Adiyaman", center: [37.7648, 38.2786], span: [0.35, 0.45] },
  { code: "afyonkarahisar", name: "Afyonkarahisar", center: [38.7638, 30.5403], span: [0.48, 0.6] },
  { code: "agri", name: "Agri", center: [39.7191, 43.0503], span: [0.45, 0.55] },
  { code: "aksaray", name: "Aksaray", center: [38.3687, 34.037], span: [0.35, 0.45] },
  { code: "amasya", name: "Amasya", center: [40.6499, 35.8353], span: [0.35, 0.45] },
  { code: "ankara", name: "Ankara", center: [39.9334, 32.8597], span: [0.65, 0.85] },
  { code: "antalya", name: "Antalya", center: [36.8969, 30.7133], span: [0.7, 0.95] },
  { code: "ardahan", name: "Ardahan", center: [41.1105, 42.7022], span: [0.3, 0.45] },
  { code: "artvin", name: "Artvin", center: [41.1828, 41.8183], span: [0.35, 0.5] },
  { code: "aydin", name: "Aydin", center: [37.8444, 27.8458], span: [0.45, 0.55] },
  { code: "balikesir", name: "Balikesir", center: [39.6484, 27.8826], span: [0.6, 0.8] },
  { code: "bartin", name: "Bartin", center: [41.6358, 32.3375], span: [0.25, 0.35] },
  { code: "batman", name: "Batman", center: [37.8812, 41.1351], span: [0.3, 0.4] },
  { code: "bayburt", name: "Bayburt", center: [40.2589, 40.227], span: [0.3, 0.35] },
  { code: "bilecik", name: "Bilecik", center: [40.1553, 29.9833], span: [0.3, 0.4] },
  { code: "bingol", name: "Bingol", center: [38.8854, 40.4983], span: [0.35, 0.45] },
  { code: "bitlis", name: "Bitlis", center: [38.4011, 42.1078], span: [0.35, 0.45] },
  { code: "bolu", name: "Bolu", center: [40.7326, 31.6082], span: [0.35, 0.45] },
  { code: "burdur", name: "Burdur", center: [37.7167, 30.2833], span: [0.35, 0.45] },
  { code: "bursa", name: "Bursa", center: [40.1885, 29.061], span: [0.45, 0.6] },
  { code: "canakkale", name: "Canakkale", center: [40.1467, 26.4086], span: [0.65, 0.9] },
  { code: "cankiri", name: "Cankiri", center: [40.6013, 33.6134], span: [0.35, 0.45] },
  { code: "corum", name: "Corum", center: [40.5506, 34.9556], span: [0.45, 0.55] },
  { code: "denizli", name: "Denizli", center: [37.783, 29.0963], span: [0.45, 0.55] },
  { code: "diyarbakir", name: "Diyarbakir", center: [37.9144, 40.2306], span: [0.6, 0.75] },
  { code: "duzce", name: "Duzce", center: [40.8438, 31.1565], span: [0.25, 0.35] },
  { code: "edirne", name: "Edirne", center: [41.6771, 26.5557], span: [0.45, 0.55] },
  { code: "elazig", name: "Elazig", center: [38.681, 39.2264], span: [0.4, 0.5] },
  { code: "erzincan", name: "Erzincan", center: [39.75, 39.5], span: [0.45, 0.55] },
  { code: "erzurum", name: "Erzurum", center: [39.9043, 41.2679], span: [0.65, 0.75] },
  { code: "eskisehir", name: "Eskisehir", center: [39.7667, 30.5256], span: [0.45, 0.55] },
  { code: "gaziantep", name: "Gaziantep", center: [37.0662, 37.3833], span: [0.42, 0.52] },
  { code: "giresun", name: "Giresun", center: [40.9128, 38.3895], span: [0.35, 0.45] },
  { code: "gumushane", name: "Gumushane", center: [40.4603, 39.4814], span: [0.38, 0.48] },
  { code: "hakkari", name: "Hakkari", center: [37.5744, 43.7408], span: [0.5, 0.6] },
  { code: "hatay", name: "Hatay", center: [36.2021, 36.1605], span: [0.4, 0.52] },
  { code: "igdir", name: "Igdir", center: [39.9237, 44.045], span: [0.32, 0.42] },
  { code: "isparta", name: "Isparta", center: [37.7648, 30.5566], span: [0.35, 0.45] },
  { code: "istanbul", name: "Istanbul", center: [41.0082, 28.9784], span: [0.38, 0.62] },
  { code: "izmir", name: "Izmir", center: [38.4237, 27.1428], span: [0.45, 0.6] },
  { code: "kahramanmaras", name: "Kahramanmaras", center: [37.5858, 36.9371], span: [0.55, 0.65] },
  { code: "karabuk", name: "Karabuk", center: [41.2, 32.6333], span: [0.3, 0.4] },
  { code: "karaman", name: "Karaman", center: [37.1811, 33.215], span: [0.38, 0.48] },
  { code: "kars", name: "Kars", center: [40.6013, 43.0975], span: [0.45, 0.55] },
  { code: "kastamonu", name: "Kastamonu", center: [41.3887, 33.7827], span: [0.55, 0.7] },
  { code: "kayseri", name: "Kayseri", center: [38.7225, 35.4875], span: [0.6, 0.75] },
  { code: "kilis", name: "Kilis", center: [36.7184, 37.1212], span: [0.25, 0.3] },
  { code: "kirikkale", name: "Kirikkale", center: [39.8468, 33.5153], span: [0.3, 0.4] },
  { code: "kirklareli", name: "Kirklareli", center: [41.7333, 27.2167], span: [0.42, 0.52] },
  { code: "kirsehir", name: "Kirsehir", center: [39.1458, 34.1639], span: [0.35, 0.45] },
  { code: "kocaeli", name: "Kocaeli", center: [40.8533, 29.8815], span: [0.3, 0.4] },
  { code: "konya", name: "Konya", center: [37.8746, 32.4932], span: [0.95, 1.15] },
  { code: "kutahya", name: "Kutahya", center: [39.4167, 29.9833], span: [0.45, 0.55] },
  { code: "malatya", name: "Malatya", center: [38.3552, 38.3095], span: [0.55, 0.7] },
  { code: "manisa", name: "Manisa", center: [38.6191, 27.4289], span: [0.48, 0.58] },
  { code: "mardin", name: "Mardin", center: [37.3212, 40.7245], span: [0.45, 0.65] },
  { code: "mersin", name: "Mersin", center: [36.8121, 34.6415], span: [0.6, 0.8] },
  { code: "mugla", name: "Mugla", center: [37.2153, 28.3636], span: [0.7, 0.9] },
  { code: "mus", name: "Mus", center: [38.9462, 41.7539], span: [0.42, 0.52] },
  { code: "nevsehir", name: "Nevsehir", center: [38.6247, 34.714], span: [0.32, 0.42] },
  { code: "nigde", name: "Nigde", center: [37.9698, 34.6766], span: [0.35, 0.45] },
  { code: "ordu", name: "Ordu", center: [40.9839, 37.8764], span: [0.38, 0.48] },
  { code: "osmaniye", name: "Osmaniye", center: [37.0742, 36.2478], span: [0.3, 0.4] },
  { code: "rize", name: "Rize", center: [41.02, 40.5234], span: [0.32, 0.42] },
  { code: "sakarya", name: "Sakarya", center: [40.7731, 30.3948], span: [0.35, 0.45] },
  { code: "samsun", name: "Samsun", center: [41.2867, 36.33], span: [0.45, 0.6] },
  { code: "sanliurfa", name: "Sanliurfa", center: [37.1674, 38.7955], span: [0.7, 0.9] },
  { code: "siirt", name: "Siirt", center: [37.9333, 41.95], span: [0.38, 0.48] },
  { code: "sinop", name: "Sinop", center: [42.0231, 35.1531], span: [0.25, 0.45] },
  { code: "sirnak", name: "Sirnak", center: [37.5164, 42.4611], span: [0.48, 0.6] },
  { code: "sivas", name: "Sivas", center: [39.7477, 37.0179], span: [0.9, 1.1] },
  { code: "tekirdag", name: "Tekirdag", center: [40.978, 27.511], span: [0.4, 0.5] },
  { code: "tokat", name: "Tokat", center: [40.3139, 36.5544], span: [0.45, 0.55] },
  { code: "trabzon", name: "Trabzon", center: [41.0015, 39.7178], span: [0.35, 0.45] },
  { code: "tunceli", name: "Tunceli", center: [39.1079, 39.5483], span: [0.35, 0.45] },
  { code: "usak", name: "Usak", center: [38.6823, 29.4082], span: [0.35, 0.45] },
  { code: "van", name: "Van", center: [38.4891, 43.4089], span: [0.6, 0.7] },
  { code: "yalova", name: "Yalova", center: [40.655, 29.2842], span: [0.2, 0.25] },
  { code: "yozgat", name: "Yozgat", center: [39.8181, 34.8147], span: [0.5, 0.6] },
  { code: "zonguldak", name: "Zonguldak", center: [41.4564, 31.7987], span: [0.35, 0.45] },
];

export const PROVINCES: ProvinceConfig[] = provinceSeeds
  .map(toBounds)
  .sort((left, right) => left.name.localeCompare(right.name));

export function getProvinceByCode(code: string): ProvinceConfig | undefined {
  return PROVINCES.find((province) => province.code === code);
}
