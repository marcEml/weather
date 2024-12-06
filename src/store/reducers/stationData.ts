import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the shape of the station data
interface IStationData {
  date: string;
  location: string;
  visibility: string;
  temperatureMax: string;
  temperature: string;
  temperatureMin: string;
  tempVariation: string;
  humidity: string;
  pressure: string;
  windSpeed: string;
  dewPoint: string;
}

interface IDataState {
  loading: boolean;
  stations: string[];
  error: string | null;
  stationData: IStationData[] | null;
}

const initialState: IDataState = {
  error: null,
  stations: [],
  loading: false,
  stationData: null,
};

// Async Thunk to fetch station data for a selected station
export const fetchStationData = createAsyncThunk<IStationData[], string[]>(
  "stations/fetchStationData",
  async (stationIds: string[], { rejectWithValue }) => {
    try {
      const fetchPromises = stationIds.map((stationId) =>
        axios.get(`http://localhost:2803/api/weather?resourceId=${stationId}`)
      );

      const responses = await Promise.all(fetchPromises);
      return responses.map((response) => response.data); // Extract data from all responses
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const stationsDataSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    // Manually set stations (if needed)
    setStations: (state, action: PayloadAction<string[]>) => {
      state.stations = action.payload;
    },
    // Clear station data when no station is selected or on reset
    clearStationData: (state) => {
      state.stationData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStationData.fulfilled, (state, action: PayloadAction<IStationData[]>) => {
        state.loading = false;
        state.stationData = action.payload;
      })
      .addCase(fetchStationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStations, clearStationData } = stationsDataSlice.actions;
export default stationsDataSlice.reducer;
