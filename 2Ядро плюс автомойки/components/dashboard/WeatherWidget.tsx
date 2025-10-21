
import React from 'react';
import { Cloud, CloudRain, Sun, Wind, CloudSun, Snowflake } from 'lucide-react';
import { WeatherData } from '../../types';
import { Skeleton } from '../ui/Skeleton';

interface WeatherWidgetProps {
  weather: WeatherData;
}

const getWeatherIcon = (condition: string, size = "w-12 h-12") => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('дождь') || conditionLower.includes('rain')) return <CloudRain className={size} />;
    if (conditionLower.includes('облачно') || conditionLower.includes('cloud')) return <Cloud className={size} />;
    if (conditionLower.includes('солнечно') || conditionLower.includes('sunny') || conditionLower.includes('ясно')) return <Sun className={size} />;
    if (conditionLower.includes('переменная') || conditionLower.includes('partly')) return <CloudSun className={size} />;
    if (conditionLower.includes('снег') || conditionLower.includes('snow')) return <Snowflake className={size} />;
    return <Cloud className={size} />;
};


export function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-5xl font-bold">{Math.round(weather.current.temp)}°</div>
          <div className="text-lg opacity-90">{weather.current.condition}</div>
          <div className="text-sm opacity-75 flex items-center gap-2 mt-1">
            <Wind className="w-4 h-4" />
            {weather.current.wind_speed} м/с
          </div>
        </div>
        <div className="opacity-90">
          {getWeatherIcon(weather.current.condition, "w-16 h-16")}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {weather.forecast.slice(0, 3).map((day, index) => (
          <div key={index} className="text-center bg-white/10 rounded-lg p-2">
            <div className="text-xs opacity-75 mb-1">{day.date}</div>
            <div className="opacity-90 mx-auto flex justify-center mb-1">
              {getWeatherIcon(day.condition, "w-6 h-6")}
            </div>
            <div className="text-sm font-semibold">{Math.round(day.temp_day)}°</div>
          </div>
        ))}
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
        <div className="text-xs font-semibold mb-1 flex items-center gap-1.5">
            <span className="text-base">🤖</span>
            <span>Прогноз AI</span>
        </div>
        <div className="text-xs opacity-90 leading-snug">
          {weather.ai_analysis.impact_on_business}
        </div>
      </div>
    </div>
  );
}

export function WeatherSkeleton() {
    return <Skeleton className="h-[280px] w-full rounded-2xl" />;
}
