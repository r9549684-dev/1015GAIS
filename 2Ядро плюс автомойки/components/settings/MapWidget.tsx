import React from 'react';
import { MapPin } from 'lucide-react';

export function MapWidget() {
  return (
    <div 
      className="h-24 bg-cover bg-center relative rounded-b-xl overflow-hidden" 
      style={{backgroundImage: "url('https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=37.620393,55.753960&z=12&l=map&size=600,300')"}}
    >
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="p-2 bg-white/30 backdrop-blur-sm rounded-full">
          <MapPin className="w-6 h-6 text-red-500" fill="white" />
        </div>
      </div>
       <button className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-md bg-white/80 backdrop-blur-sm text-black font-semibold">
        Показать на карте
      </button>
    </div>
  );
}