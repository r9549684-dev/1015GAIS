import React from 'react';
import { useWashBoxDetailModalStore } from '../../stores/useWashBoxDetailModalStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { X, Bot, Users } from 'lucide-react';
import { WashBox } from '../../types';

interface WashBoxDetailModalProps {
  box: WashBox;
}

export function WashBoxDetailModal({ box }: WashBoxDetailModalProps) {
  const { closeModal } = useWashBoxDetailModalStore();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <Card className="w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{box.name}</CardTitle>
          <button type="button" onClick={closeModal} className="p-1 rounded-full hover:bg-[var(--tg-theme-secondary-bg-color)]">
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg flex items-center gap-3" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            {box.type === 'automatic' 
                ? <Bot className="w-6 h-6 text-blue-500" /> 
                : <Users className="w-6 h-6 text-green-500" />
            }
            <div>
                <p className="font-semibold text-sm">Тип бокса</p>
                <p className="text-xs">{box.type === 'automatic' ? 'Автоматический' : 'С персоналом'}</p>
            </div>
          </div>
          
          {box.type === 'manual' && box.masters.length > 0 && (
            <div>
                <h4 className="font-semibold text-sm mb-2">Мастера в боксе:</h4>
                <div className="space-y-2">
                    {box.masters.map(master => (
                        <div key={master.id} className="p-2 rounded-lg text-sm" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                            {master.name}
                        </div>
                    ))}
                </div>
            </div>
          )}
          {box.type === 'manual' && box.masters.length === 0 && (
             <p className="text-sm text-center py-2" style={{color: 'var(--tg-theme-hint-color)'}}>Нет привязанных мастеров.</p>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
