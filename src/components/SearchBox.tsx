import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice";
import { useGeocodeQuery } from "../features/weather/weatherApi";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number>(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { data, isFetching } = useGeocodeQuery(q, {
    skip: q.trim().length < 3,
  });
  const results = data?.results ?? [];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const select = (i: number) => {
    const r = results[i];
    if (!r) return;
    const label = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    dispatch(
      setLocation({
        label,
        lat: r.latitude,
        lon: r.longitude,
        source: "search",
      })
    );
    setQ(label);
    setOpen(false);
    setActive(-1);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0) return select(active);
    if (results[0]) return select(0);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((p) => (p + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((p) => (p <= 0 ? results.length - 1 : p - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      select(active);
    } else if (e.key === "Escape") {
      setQ("");
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form className="search-row" onSubmit={onSubmit}>
      <div className="search" ref={wrapRef} style={{ flex: 1 }}>
        <input
          className="search-input"
          placeholder="Another location"
          value={q}
          onFocus={() => q.trim().length >= 3 && setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(e.target.value.trim().length >= 3);
            setActive(-1);
          }}
          onKeyDown={onKey}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />

        {/* Крестик очистки внутри поля */}
        {q && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear"
            onMouseDown={(e) => e.preventDefault()} // не отдаём фокус и не триггерим submit
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQ("");
              setOpen(false);
              setActive(-1);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {open && (
          <div className="dropdown" role="listbox">
            {isFetching && <div className="empty">Searching…</div>}
            {!isFetching && results.length === 0 && (
              <div className="empty">No results</div>
            )}
            {!isFetching &&
              results.slice(0, 8).map((r, i) => {
                const label = [r.name, r.admin1, r.country]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <button
                    type="button"
                    key={`${label}-${i}`}
                    className={i === active ? "active" : ""}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(i)}
                    role="option"
                  >
                    {label}
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Отдельная правая квадратная кнопка сабмита по макету */}
      <button className="search-btn" aria-label="Search" type="submit">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line
            x1="20"
            y1="20"
            x2="16.65"
            y2="16.65"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>
    </form>
  );
}
