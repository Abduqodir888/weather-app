import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useGetWeatherQuery } from "../features/weather/weatherApi";

export default function WeatherDetails() {
  const loc = useSelector((s: RootState) => s.location.selected) ?? {
    lat: 41.2995,
    lon: 69.2401,
    label: "Tashkent City",
    source: "region" as const,
  };

  const { data } = useGetWeatherQuery({ lat: loc.lat, lon: loc.lon });
  const cw = data?.current_weather;
  const h = (data as any)?.hourly as
    | {
        cloudcover?: number[];
        relative_humidity_2m?: number[];
        precipitation?: number[];
      }
    | undefined;

  const last = <T,>(arr?: T[]) =>
    arr && arr.length ? arr[arr.length - 1] : undefined;
  const cloudy = last(h?.cloudcover) ?? "—";
  const hum = last(h?.relative_humidity_2m) ?? "—";
  const rain = last(h?.precipitation) ?? "0";

  return (
    <div className="details">
      <h4>Weather Details</h4>
      <div className="row">
        <span>Cloudy</span>
        <span>{cloudy}%</span>
      </div>
      <div className="row">
        <span>Humidity</span>
        <span>{hum}%</span>
      </div>
      <div className="row">
        <span>Wind</span>
        <span>{cw ? Math.round(cw.windspeed) : 0}km/h</span>
      </div>
      <div className="row">
        <span>Rain</span>
        <span>{rain}mm</span>
      </div>
    </div>
  );
}
