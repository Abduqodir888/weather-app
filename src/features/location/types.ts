export interface Location {
  label: string;
  lat: number;
  lon: number;
  source: "region" | "country" | "search";
}
