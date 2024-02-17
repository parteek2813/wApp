"use client";
import "../../globals.css";
import React, { useEffect, useState } from "react";
import { fetchWeatherData, fiveDayForecastData } from "../../../utils/lib"; // Replace with the actual utility function for fetching weather data
import Link from "next/link";

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface PageProps {
  params: {
    location: string;
  };
}

interface FiveDayForecastListData {
  main: {
    temp_min: number;
    temp_max: number;
  };
  dt: number;
}

interface FiveDayForecastData {
  list: FiveDayForecastListData[];
}

const WeatherPage: React.FC<PageProps> = ({ params }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [fiveDayForecast, setFiveDayForecast] =
    useState<FiveDayForecastData | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<string>("Celsius");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherData(params.location);
        const forecastData = await fiveDayForecastData(params.location);
        setWeatherData(data);
        setFiveDayForecast(forecastData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, [params.location]);

  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prevUnit) =>
      prevUnit === "Celsius" ? "Fahrenheit" : "Celsius"
    );
  };

  const convertTemperature = (temp: number, unit: string) => {
    if (unit === "Fahrenheit") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  return (
    <div className="container mx-auto p-4">
      {weatherData && fiveDayForecast ? (
        <div>
          <h1 className="text-3xl font-semibold mb-4">
            Weather in {weatherData.name}, {weatherData.sys.country}
          </h1>
          <div className="mb-4 flex justify-between">
            <Link
              href="/"
              className="inline-block bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition duration-300"
            >
              Back to Home
            </Link>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={temperatureUnit === "Fahrenheit"}
                onChange={toggleTemperatureUnit}
              />
              <div
                className={`
      relative w-11 h-6 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600 ${
        temperatureUnit === "Fahrenheit"
          ? "bg-gray-200"
          : "bg-transparent border-teal-500 border"
      }`}
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900">
                Switch to{" "}
                {temperatureUnit === "Celsius" ? "Fahrenheit" : "Celsius"}
              </span>
            </label>
          </div>

          {/* Current Temparature */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Temperature</p>
              <p>
                {convertTemperature(weatherData.main.temp, temperatureUnit)}{" "}
                {temperatureUnit === "Celsius" ? "°C" : "°F"}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Feels Like</p>
              <p>
                {convertTemperature(
                  weatherData.main.feels_like,
                  temperatureUnit
                )}{" "}
                {temperatureUnit === "Celsius" ? "°C" : "°F"}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Min Temperature</p>
              <p>
                {convertTemperature(weatherData.main.temp_min, temperatureUnit)}{" "}
                {temperatureUnit === "Celsius" ? "°C" : "°F"}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Max Temperature</p>
              <p>
                {convertTemperature(weatherData.main.temp_max, temperatureUnit)}{" "}
                {temperatureUnit === "Celsius" ? "°C" : "°F"}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Pressure</p>
              <p>{weatherData.main.pressure} hPa</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Humidity</p>
              <p>{weatherData.main.humidity}%</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Visibility</p>
              <p>{weatherData.visibility} meters</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Wind Speed</p>
              <p>{weatherData.wind.speed} m/s</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Wind Direction</p>
              <p>{weatherData.wind.deg}°</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Cloudiness</p>
              <p>{weatherData.clouds.all}%</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Sunrise</p>
              <p>
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Sunset</p>
              <p>
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-6 mb-4">5-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {fiveDayForecast.list.flatMap((forecastItem, index) => {
                if (new Date(forecastItem.dt * 1000).getUTCHours() === 6) {
                  const forecastDate = new Date(forecastItem.dt * 1000);

                  const formattedDateTime = forecastDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  );

                  return (
                    <div key={index} className="bg-gray-100 p-4 rounded-md">
                      <p className="text-lg font-semibold">
                        {formattedDateTime}
                      </p>
                      <p>
                        Min Temperature:{" "}
                        {convertTemperature(
                          forecastItem.main.temp_min,
                          temperatureUnit
                        )}{" "}
                        {temperatureUnit === "Celsius" ? "°C" : "°F"}
                      </p>
                      <p>
                        Max Temperature:{" "}
                        {convertTemperature(
                          forecastItem.main.temp_max,
                          temperatureUnit
                        )}{" "}
                        {temperatureUnit === "Celsius" ? "°C" : "°F"}
                      </p>
                    </div>
                  );
                } else {
                  return [];
                }
              })}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default WeatherPage;
