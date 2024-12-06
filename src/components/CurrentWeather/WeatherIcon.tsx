import React from "react";
import { ReactComponent as CloudyIcon } from "../../assets/weather/cloudy.svg";
import { ReactComponent as HazeIcon } from "../../assets/weather/haze.svg";
import { ReactComponent as HeavyRainIcon } from "../../assets/weather/heavy-rain.svg";
import { ReactComponent as PartlyCloudyIcon } from "../../assets/weather/partly-cloudy.svg";
import { ReactComponent as RainIcon } from "../../assets/weather/rain.svg";
import { ReactComponent as SleetIcon } from "../../assets/weather/sleet.svg";
import { ReactComponent as SnowIcon } from "../../assets/weather/snow.svg";
import { ReactComponent as SunnyIcon } from "../../assets/weather/sunny.svg";
import { ReactComponent as ThunderstormIcon } from "../../assets/weather/thunderstorm.svg";

interface IWeatherIconProps {
  code: number;
  big?: boolean;
}

const WeatherIcon: React.FC<IWeatherIconProps> = (props) => {
  console.log(props.code);
  let Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  if (props.code > 25) {
    Icon = SunnyIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  } else if (props.code <= 25 && props.code > 12) {
    Icon = PartlyCloudyIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  } else if (props.code <= 25 && props.code > 12) {
    Icon = CloudyIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  } else if (props.code <= 12 && props.code > 3) {
    Icon = SleetIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  } else if (props.code <= 3) {
    Icon = SnowIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  } else {
    Icon = SunnyIcon;
    return props.big ? <Icon style={{ width: "100px", height: "100px" }} /> : <Icon />;
  }
};

export default WeatherIcon;
