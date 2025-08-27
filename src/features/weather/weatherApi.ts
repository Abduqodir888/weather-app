import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GeoItem {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}
interface GeoResp {
  results?: GeoItem[];
}

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
}
interface HourlyResp {
  time: string[];
  relative_humidity_2m?: number[];
  cloudcover?: number[];
  precipitation?: number[];
}
interface WeatherResp {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  hourly?: HourlyResp;
}

interface Country {
  name: { common: string };
  capital?: string[];
  capitalInfo?: { latlng?: [number, number] };
  latlng?: [number, number];
  cca2: string;
}

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({}),
  endpoints: (b) => ({
    geocode: b.query<GeoResp, string>({
      query: (q) => ({
        url: "https://geocoding-api.open-meteo.com/v1/search",
        params: { name: q, count: 10, language: "en", format: "json" },
      }),
    }),

    getWeather: b.query<WeatherResp, { lat: number; lon: number }>({
      query: ({ lat, lon }) => ({
        url: "https://api.open-meteo.com/v1/forecast",
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly: "relative_humidity_2m,cloudcover,precipitation",
          timezone: "auto",
        },
      }),
    }),
    countries: b.query<Country[], void>({
      query: () => ({ url: "https://restcountries.com/v3.1/all" }),
      transformResponse: (d: Country[]) =>
        d
          .filter(Boolean)
          .sort((a, b) => a.name.common.localeCompare(b.name.common)),
    }),
  }),
});

export const { useGeocodeQuery, useGetWeatherQuery, useCountriesQuery } =
  weatherApi;
