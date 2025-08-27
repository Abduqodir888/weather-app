import { UZB_REGIONS } from "../features/location/uzbRegions";
import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice";

export default function RegionList() {
  const dispatch = useDispatch();
  return (
    <div className="region-list">
      <ul>
        {UZB_REGIONS.map((r) => (
          <li key={r.label}>
            <button onClick={() => dispatch(setLocation(r))}>{r.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
