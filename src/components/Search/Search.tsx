import Select from "react-select";
import React, { useEffect } from "react";
import { AppStore } from "../../store/store";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import { fetchStationData } from "../../store/reducers/stationData";
import { fetchStations, setSelectedStation } from "../../store/reducers/stationsSlice";

const Search: React.FC = () => {
  const dispatch: any = useDispatch();
  const animatedComponents = makeAnimated();
  const { stations, loading, error } = useSelector((state: AppStore) => state.stations);

  const handleStationChange = (stations: any) => {
    var stationList: any[] = [];
    stations.map((station: any) => stationList.push(station.value));
    
    dispatch(setSelectedStation(stationList));
    dispatch(fetchStationData(stationList));
  };

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  if (error) return <div>Error: {error}</div>;

  const options = stations.map((station: any) => ({
    value: station.stationId,
    label: station.stationId,
  }));

  return !loading ? (
    <div className="m-1">
      <Select
        isMulti
        options={options}
        closeMenuOnSelect={true}
        components={animatedComponents}
        onChange={(station: any) => {
          handleStationChange(station);
        }}
      />
    </div>
  ) : (
    <div></div>
  );
};

export default Search;
