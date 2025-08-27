import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { useGetWeatherQuery } from "../features/weather/weatherApi";
import { setTheme } from "../features/ui/uiSlice";
import { codeToTheme } from "../utils/weatherWallpaper";
import { useEffect } from "react";

const DEFAULT = { label: "Tashkent City", lat: 41.2995, lon: 69.2401 };

export default function WeatherView() {
  const dispatch = useDispatch();
  const selected =
    useSelector((s: RootState) => s.location.selected) ?? DEFAULT;
  const { data } = useGetWeatherQuery({ lat: selected.lat, lon: selected.lon });
  const cw = data?.current_weather;

  useEffect(() => {
    if (cw) dispatch(setTheme(codeToTheme(cw.weathercode)));
  }, [cw, dispatch]);

  const dt = cw ? new Date(cw.time) : null;
  const t = dt
    ? dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const d = dt
    ? dt.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
    : "";

  return (
    <section className="hero-content">
      <div className="temp">{cw ? Math.round(cw.temperature) : "--"}°</div>
      <div className="city">
        {selected.label}
        <div className="meta">
          {t} – {d}
        </div>
      </div>
      <div className="cond">
        <span className="icon"/>
        <span className="name">{cw ? codeToTheme(cw.weathercode) : ""}</span>
      </div>
    </section>
  );
}
