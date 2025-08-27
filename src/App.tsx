import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import WeatherView from "./components/WeatherView";
import RegionList from "./components/RegionList";
import SearchBox from "./components/SearchBox";
import WeatherDetails from "./components/WeatherDetails";

export default function App() {
  const theme = useSelector((s: RootState) => s.ui.theme);

  return (
    <div className={`shell theme--${theme}`}>
      <div className="hero">
        <WeatherView />
      </div>
      <aside className="side">
        <div className="side-inner">
          <SearchBox />
          <RegionList />
          <div className="bottom">
            <hr className="divider" />
            <WeatherDetails />
          </div>
        </div>
      </aside>
    </div>
  );
}
