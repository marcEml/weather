import appReducer from "./reducers/appReducer";
import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./reducers/weatherReducer";
import stationsReducer from "./reducers/stationsSlice";
import stationsDataSlice from "./reducers/stationData";

const store = configureStore({
  reducer: {
    app: appReducer,
    weather: weatherReducer,
    stations: stationsReducer,
    stationData: stationsDataSlice,
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export default store;
