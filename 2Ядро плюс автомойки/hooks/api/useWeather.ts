
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { WeatherData } from '../../types';

export function useWeather(city: string = 'Moscow') {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather', city],
    queryFn: () => api.get(`/weather?city=${city}`),
  });
}
