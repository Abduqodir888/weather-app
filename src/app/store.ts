import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../features/weather/weatherApi";
import locationReducer from "../features/location/locationSlice";
import uiReducer from "../features/ui/uiSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const uiPersist = persistReducer({ key: "ui", storage }, uiReducer);
const locationPersist = persistReducer(
  { key: "location", storage },
  locationReducer
);

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    ui: uiPersist,
    location: locationPersist,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(weatherApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
