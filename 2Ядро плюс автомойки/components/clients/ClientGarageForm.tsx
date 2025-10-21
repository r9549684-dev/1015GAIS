import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ClientCar } from '../../types';
import { Car, PlusCircle, Trash2 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

interface ClientGarageFormProps {
  cars: Partial<ClientCar>[];
  setCars: (cars: Partial<ClientCar>[]) => void;
}

const emptyCar: Partial<ClientCar> = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plate_number: '',
  color: '',
  body_type: 'sedan',
};

export function ClientGarageForm({ cars, setCars }: ClientGarageFormProps) {
  const [newCar, setNewCar] = useState<Partial<ClientCar>>(emptyCar);
  const [isAdding, setIsAdding] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCar = () => {
    if (!newCar.brand || !newCar.model || !newCar.plate_number) {
        WebApp.showAlert('Пожалуйста, заполните марку, модель и госномер автомобиля.');
        return;
    }
    setCars([...cars, { ...newCar, id: `new_${Date.now()}` }]);
    setNewCar(emptyCar);
    setIsAdding(false);
    WebApp.HapticFeedback.impactOccurred('light');
  };

  const handleRemoveCar = (idToRemove?: string) => {
    if (!idToRemove) return;
    setCars(cars.filter(car => car.id !== idToRemove));
    WebApp.HapticFeedback.impactOccurred('light');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500" />
            <span>Гараж</span>
        </CardTitle>
        {!isAdding && (
            <button type="button" onClick={() => setIsAdding(true)}>
                <PlusCircle className="w-5 h-5 text-[var(--tg-theme-hint-color)]" />
            </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {cars.map((car, index) => (
          <div key={car.id || `car-${index}`} className="p-3 rounded-lg flex justify-between items-center" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            <div>
              <p className="font-semibold text-sm">{car.brand} {car.model}</p>
              <p className="text-xs font-mono px-1.5 py-0.5 mt-1 inline-block border rounded" style={{borderColor: 'var(--tg-theme-hint-color)'}}>{car.plate_number}</p>
            </div>
            <button type="button" onClick={() => handleRemoveCar(car.id)} aria-label="Удалить автомобиль">
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
        
        {isAdding && (
          <div className="p-3 border-t space-y-3" style={{borderColor: 'var(--tg-theme-secondary-bg-color)'}}>
             <div className="grid grid-cols-2 gap-2">
                <input type="text" name="brand" value={newCar.brand} onChange={handleInputChange} placeholder="Марка" className="input-style" />
                <input type="text" name="model" value={newCar.model} onChange={handleInputChange} placeholder="Модель" className="input-style" />
             </div>
             <input type="text" name="plate_number" value={newCar.plate_number} onChange={handleInputChange} placeholder="Госномер" className="input-style w-full" />
             <div className="grid grid-cols-2 gap-2">
                 <input type="number" name="year" value={newCar.year} onChange={handleInputChange} placeholder="Год" className="input-style" />
                 <input type="text" name="color" value={newCar.color} onChange={handleInputChange} placeholder="Цвет" className="input-style" />
             </div>
             <select name="body_type" value={newCar.body_type} onChange={handleInputChange} className="input-style w-full appearance-none">
                <option value="sedan">Седан</option>
                <option value="suv">Внедорожник</option>
                <option value="crossover">Кроссовер</option>
                <option value="minivan">Минивэн</option>
             </select>
             <div className="flex gap-2">
                <button type="button" onClick={handleAddCar} className="flex-1 p-2 rounded-lg text-sm font-semibold" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
                    Добавить
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 p-2 rounded-lg text-sm" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    Отмена
                </button>
             </div>
          </div>
        )}
         <style>{`
            .input-style {
                background-color: var(--tg-theme-secondary-bg-color);
                color: var(--tg-theme-text-color);
                width: 100%;
                padding: 8px 12px;
                border-radius: 8px;
                border: 1px solid transparent;
                font-size: 14px;
            }
            .input-style:focus {
                outline: none;
                border-color: var(--tg-theme-button-color);
            }
         `}</style>
      </CardContent>
    </Card>
  );
}
