import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudSun, Droplets, Wind, MapPin } from "lucide-react";

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

const WeatherWidget = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [status, setStatus] = useState("loading"); // loading | error | success

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
          );
          const weatherData = await weatherRes.json();
          setWeather(weatherData.current);

          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`
          );
          const geoData = await geoRes.json();
          const place = geoData.results?.[0];
          setLocationName(place ? `${place.name}, ${place.admin1 || ""}` : "");

          setStatus("success");
        } catch (err) {
          setStatus("error");
        }
      },
      () => setStatus("error")
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-sm p-5 text-white flex items-center justify-center h-full min-h-[140px]">
        <span className="text-sm text-green-100">{t("common.loading")}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-sm p-5 text-white flex flex-col items-center justify-center h-full min-h-[140px] text-center">
        <CloudSun size={32} className="text-white/70 mb-2" />
        <span className="text-sm text-green-100">Enable location access to see local weather</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-sm p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-100 text-sm flex items-center gap-1">
            <MapPin size={12} />
            {locationName || t("dashboard.location")}
          </p>
          <h3 className="text-3xl font-bold mt-1">{Math.round(weather.temperature_2m)}°C</h3>
          <p className="text-green-100 text-sm mt-1">
            {weatherCodeMap[weather.weather_code] || "—"}
          </p>
        </div>
        <CloudSun size={48} className="text-white/90" />
      </div>
      <div className="flex justify-between mt-5 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 text-sm">
          <Droplets size={16} />
          <span>{weather.relative_humidity_2m}% Humidity</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wind size={16} />
          <span>{Math.round(weather.wind_speed_10m)} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;