import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface IState {
  loading: boolean;
  stations: string[];
  error: string | null;
  selectedStation: string[] | null;
}

const initialState: IState = {
  stations: [],
  loading: false,
  error: null,
  selectedStation: null,
};

// Async Thunk to fetch stations
export const fetchStations = createAsyncThunk<string[]>(
  "stations/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:2803/api/stations");
      console.log(response.data);
      return response.data;
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

const stationsSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    // Manually set stations (if needed)
    setStations: (state, action: PayloadAction<string[]>) => {
      state.stations = action.payload;
    },
    // Set selected station
    setSelectedStation: (state, action: PayloadAction<string[]>) => {
      state.selectedStation = action.payload;
    },
    // Clear selected station (optional)
    clearSelectedStation: (state) => {
      state.selectedStation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStations, setSelectedStation, clearSelectedStation } = stationsSlice.actions;
export default stationsSlice.reducer;
