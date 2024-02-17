"use client";
import "./globals.css";
import React, { useState, useEffect } from "react";
import WeatherComponent from "../components/Card";
import ErrorMessage from "../components/ErrorMessage";
import WeatherSearch from "../components/SearchBar";
import { fetchWeatherData, fetchUserLocation } from "../utils/lib";
import Link from "next/link";
import { weatherTypes } from "../utils/interfaces";

const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<weatherTypes>(
    new weatherTypes()
  );
  const [error, setError] = useState<string | null>(null);

  const handleWeatherData = (data: any) => {
    if (data && data.cod !== "404") {
      setWeatherData(data);
      setError(null);
    } else {
      // setWeatherData(null);
      setError("City not found. Please enter a valid city name.");
    }
  };

  useEffect(() => {
    fetchUserLocation().then((data: any) => {
      fetchWeatherData(data.city).then((data) => {
        handleWeatherData(data);
      });
    });
  }, []);

  return (
    <>
      <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-r from-[#f7a945] via-transparent to-[#f7a945] bg-repeat-x bg-size-20 opacity-80">
        <h1 className="text-4xl font-bold text-black mb-8">Weather App</h1>
        <div className="w-full  h-24 max-w-md bg-white rounded-lg shadow-md p-6">
          <WeatherSearch onWeatherData={handleWeatherData} />
        </div>
        {weatherData ? (
          <div className="mt-8">
            <Link
              href={{
                pathname: `/details/${weatherData.name}`,
              }}
            >
              <WeatherComponent data={weatherData} />
            </Link>
          </div>
        ) : (
          <div>
            {error ? (
              <ErrorMessage error={error} />
            ) : (
              <p className="text-white text-lg mt-8">
                Search for a city to get the current weather
              </p>
            )}
          </div>
        )}
        <div className="mt-8">
          <p className="text-black text-lg">
            This weather app allows you to search for a city and get the current
            weather conditions.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
