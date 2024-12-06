import WeatherIcon from "./WeatherIcon";
import { AgCharts } from "ag-charts-react";
import React, { useEffect, useState } from "react";
import { TempUnit } from "../../utils/unitConversion";
import { useDispatch, useSelector } from "react-redux";

import ToggleSwitch from "../ui/ToggleSwitch/ToggleSwitch";
import { ReactComponent as LowIcon } from "../../assets/low-icon.svg";
import { ReactComponent as HighIcon } from "../../assets/high-icon.svg";
import { ReactComponent as WindIcon } from "../../assets/wind-icon.svg";
import { ReactComponent as HumidityIcon } from "../../assets/humidity-icon.svg";
import { ReactComponent as PressureIcon } from "../../assets/pressure-icon.svg";

import {
  InfoRow,
  FeelsLike,
  SectionTitle,
  WeatherDegree,
  HighLowContainer,
  WeatherContainer,
  CurrentWeatherInfo,
  CurrentWeatherStatus,
  CurrentWeatherContainer,
} from "./styled";

import axios from "axios";
import { Modal } from "flowbite-react";
import Temperature from "./Temperature";
import { AppStore } from "../../store/store";

import Select from "react-select";
import ChartButton from "./components/ChartButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ToggleChartSwitch from "../ui/ToggleSwitch/ToggleChartSwitch";
import { setSelectedStation } from "../../store/reducers/stationsSlice";

const CurrentWeather: React.FC = () => {
  const dispatch = useDispatch();
  const { stations } = useSelector((state: AppStore) => state.stations);
  const { selectedStation } = useSelector((state: AppStore) => state.stations);
  const { stationData, loading, error } = useSelector((state: AppStore) => state.stationData);

  // Simulate weather data for testing
  const [openModal, setOpenModal] = useState(false);
  const [degreeType, setDegreeType] = useState(TempUnit.CELCIUS);
  const [displayGraph, setDisplayGraph] = useState<boolean>(false);

  const handleChangeDegreeType = () => {
    if (degreeType === TempUnit.CELCIUS) {
      setDegreeType(TempUnit.FAHRENHEIT);
    } else {
      setDegreeType(TempUnit.CELCIUS);
    }
  };

  const [chartOptions, setChartOptions] = useState<any>({
    data: [],
    series: [{ type: "bar", xKey: "station", yKey: "temperature" }],
  });

  const [option, setOption] = useState<number>(0);

  useEffect(() => {
    if (stationData) {
      const updatedData = stationData.map((station, index) => ({
        station: selectedStation![index],
        temperature:
          option === 0
            ? parseInt((parseInt(station.temperature) - 273.15).toFixed(0))
            : option === 1
            ? parseInt((parseInt(station.temperatureMin) - 273.15).toFixed(0))
            : option === 2
            ? parseInt((parseInt(station.temperatureMax) - 273.15).toFixed(0))
            : parseInt((parseInt(station.temperatureMax) - 273.15).toFixed(0)) -
              parseInt((parseInt(station.temperatureMin) - 273.15).toFixed(0)),
      }));

      setChartOptions((prevState: any) => ({
        ...prevState,
        data: updatedData,
      }));
    }
  }, [stationData, option, selectedStation]);

  const [variationData, setVariationData] = useState<any[]>([]);
  const [options, setOptions] = useState<any>({
    title: {
      text: "Temperature Variations",
    },
    data: variationData,
    series: [
      {
        type: "line",
        xKey: "date",
        yKey: "temperature",
        yName: "Temperature",
      },
      {
        type: "line",
        xKey: "date",
        yKey: "temperatureMax",
        yName: "Max Temperature",
      },
      {
        type: "line",
        xKey: "date",
        yKey: "temperatureMin",
        yName: "Min Temperature",
      },
    ],
  });

  const stationsOptions = stations.map((station: any) => ({
    value: station.stationId,
    label: station.stationId,
  }));

  const postData = async () => {
    try {
      const url = "http://localhost:2803/api/station/variation?stationId=" + selectedStation![0];

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Transform API data
      const apiData = response.data.map((item: any, index: number) => ({
        date: index,
        temperature: parseFloat(item.temperature),
        temperatureMax: parseFloat(item.temperatureMax),
        temperatureMin: item.temperatureMin !== "mq" ? parseFloat(item.temperatureMin) : null, // Handle "mq" as null
      }));

      // Update variation data
      setVariationData(apiData);

      // Dynamically update options
      setOptions((prevOptions: any) => ({
        ...prevOptions,
        data: apiData,
      }));

      console.log("Response:", apiData);
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };

  if (error) return <div>Error: {error}</div>;

  function formatDate(input: string) {
    if (!/^\d{8}$/.test(input)) {
      throw new Error("Invalid input format. Expected YYYYMMDD.");
    }
    const year = input.slice(0, 4);
    const month = input.slice(4, 6);
    const day = input.slice(6, 8);
    return `${year}/${month}/${day}`;
  }

  function convertPaToBar(pressureInPa: number) {
    if (typeof pressureInPa !== "number" || pressureInPa < 0) {
      throw new Error("Invalid input. Pressure must be a non-negative number.");
    }
    const pressureInBar = pressureInPa / 100000; // 1 bar = 100,000 Pa
    return pressureInBar.toFixed(5); // Optional: Format to 5 decimal places
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="my-7">
        <div className="flex items-center gap-2 mb-5 justify-between">
          <div className="flex items-center gap-2">
            <ToggleChartSwitch onClick={() => setDisplayGraph(!displayGraph)} />
            <p>Afficher le graphe</p>
          </div>

          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Afficher un graphe de variation
          </button>
        </div>

        {displayGraph && (
          <div>
            <div className="mb-4">
              <ChartButton label={"Température"} setOption={() => setOption(0)} />
              <ChartButton label={"Température minimale"} setOption={() => setOption(1)} />
              <ChartButton label={"Température maximale"} setOption={() => setOption(2)} />
              <ChartButton label={"Variation de température"} setOption={() => setOption(3)} />
            </div>

            <AgCharts options={chartOptions} />
          </div>
        )}
      </div>

      <div>
        <Modal className="h-full" show={openModal} onClose={() => setOpenModal(false)}>
          <div className="min-h-[760px] p-4">
            <Modal.Header className="text-xl">Créer un graphe de variation</Modal.Header>
            <Modal.Body className="h-full mt-4">
              <div className="flex justify-between w-full items-end">
                <div className="flex gap-8">
                  <Select
                    options={stationsOptions}
                    onChange={(station: any) => {
                      var stationList: any[] = [];
                      stationList.push(station.value);
                      dispatch(setSelectedStation(stationList));
                    }}
                  />
                </div>

                <ChartButton classname={"relative"} label={"Valider"} setOption={postData} />
              </div>

              <AgCharts className="h-[550px] mt-9" options={options} />
            </Modal.Body>
          </div>
        </Modal>
      </div>

      {stationData && !loading
        ? stationData.map((station: any, index: number) => (
            <div>
              <WeatherContainer className="mt-9" key={index}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <SectionTitle>
                    Station {selectedStation![index]} - {formatDate(station.date.slice(0, 8))}
                  </SectionTitle>
                  <div>
                    <ToggleSwitch onClick={handleChangeDegreeType} />
                  </div>
                </div>
                <CurrentWeatherContainer>
                  <CurrentWeatherStatus>
                    <h4>{station.location}</h4>
                    <div style={{ display: "flex" }}>
                      <WeatherIcon
                        code={parseInt((parseInt(station.temperature) - 273.15).toFixed(0))}
                        big
                      />
                      <span>
                        <Temperature
                          value={
                            degreeType === TempUnit.CELCIUS
                              ? parseInt((parseInt(station.temperature) - 273.15).toFixed(0))
                              : parseInt(station.temperature)
                          }
                        />
                        <sup>&deg;</sup>
                      </span>
                    </div>
                    <h6>{"Nuageux"}</h6>
                  </CurrentWeatherStatus>

                  <CurrentWeatherInfo>
                    <FeelsLike>
                      Temp Ressentie <Temperature value={10} />
                      <sup>&deg;</sup>
                    </FeelsLike>
                    <HighLowContainer>
                      <WeatherDegree>
                        <HighIcon />
                        <Temperature
                          value={
                            degreeType === TempUnit.CELCIUS
                              ? parseInt((parseInt(station.temperatureMax) - 273.15).toFixed(0))
                              : parseInt(station.temperatureMax)
                          }
                        />
                        <sup>&deg;</sup>
                      </WeatherDegree>
                      <WeatherDegree>
                        <LowIcon />
                        <Temperature
                          value={
                            degreeType === TempUnit.CELCIUS
                              ? parseInt((parseInt(station.temperatureMin) - 273.15).toFixed(0))
                              : parseInt(station.temperatureMin)
                          }
                        />
                        <sup>&deg;</sup>
                      </WeatherDegree>
                    </HighLowContainer>
                    <InfoRow>
                      <div>
                        <HumidityIcon /> Humidité
                      </div>
                      <span>{parseInt(station.humidity)}%</span>
                    </InfoRow>
                    <InfoRow>
                      <div>
                        <WindIcon /> Vitesse du vent
                      </div>
                      <span>
                        {degreeType === TempUnit.CELCIUS
                          ? parseInt(station.windSpeed)
                          : (parseInt(station.windSpeed) * 0.62).toFixed(1)}
                        {degreeType === TempUnit.CELCIUS ? "km/h" : "m/s"}
                      </span>
                    </InfoRow>
                    <InfoRow>
                      <div>
                        <PressureIcon /> Pression
                      </div>
                      <span>{convertPaToBar(parseInt(station.pressure))} bar</span>
                    </InfoRow>
                  </CurrentWeatherInfo>
                </CurrentWeatherContainer>
              </WeatherContainer>
            </div>
          ))
        : ""}
    </LocalizationProvider>
  );
};

export default CurrentWeather;
