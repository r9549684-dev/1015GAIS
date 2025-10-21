import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { AIChatThread, AIChatMessage } from '../../types';
import { Bot, Send, Lightbulb, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import WebApp from '@twa-dev/sdk';

interface AIChatWidgetProps {
  initialThread: AIChatThread;
}

const pricing = {
    sedan: { price: 1500, duration: 60 },
    crossover: { price: 1800, duration: 70 },
    suv: { price: 2200, duration: 90 },
    minivan: { price: 2500, duration: 100 },
};

const commands = [
    { cmd: '/today', desc: 'Записи на сегодня' },
    { cmd: '/report_day', desc: 'Отчет за день' },
    { cmd: '/clients', desc: 'Найти клиента' },
    { cmd: '/stats', desc: 'Быстрая статистика' },
    { cmd: '/add_booking', desc: 'Создать запись' },
];

const getAIResponse = (prompt: string, messages: AIChatMessage[]): string => {
    const command = prompt.toLowerCase().trim();
    const lastMessage = messages[messages.length-2]?.text.toLowerCase();
    
    // Command handling
    if (command.startsWith('/')) {
        if (command === '/today') return `Записи на сегодня:\n- 10:00 Иван Петров (Комплексная мойка)\n- 11:30 Анна Сидорова (Детейлинг)\n- 15:00 Олег Смирнов (Мойка "Люкс")`;
        if (command === '/report_day') return `Финансовая сводка за сегодня:\n- Выручка: 7 500 ₽\n- Записей: 5\n- Средний чек: 1 500 ₽`;
        if (command.startsWith('/clients')) return `Поиск клиента...\n- Найдено 4 клиента.\n- Иван Петров (+79261234567)\n- Анна Сидорова (+79167654321)\n- ...\n(Полный список на странице "Клиенты")`;
        if (command === '/stats') return `Ключевые показатели за неделю:\n- Выручка: +15%\n- Новые клиенты: 8\n- Повторные визиты: 72%\n(Подробная аналитика на странице "Аналитика")`;
        if (command === '/add_booking') return `Хорошо, давайте запишем клиента. Назовите имя, услугу и желаемое время.`;
    }

    // Car Wash Dialogue Simulation
    if (command.includes('мыть') || command.includes('мойку')) {
        return "Здравствуйте! Конечно. Какой у вас автомобиль (седан, кроссовер, внедорожник)?";
    }

    if (lastMessage && lastMessage.includes('какой у вас автомобиль')) {
        const carType = command.split(' ').find(word => word in pricing) as keyof typeof pricing | undefined;
        if (carType) {
            const { price, duration } = pricing[carType];
            return `Отлично! Комплексная мойка (${carType}):\n💰 ${price}₽ | ⏱️ ${duration} минут\n\nДоступные боксы завтра:\n🟢 Бокс №2 — 10:00, 12:00\n🟢 Бокс №4 — 14:00, 17:00\n\nКакое время и бокс удобнее?`;
        }
    }
    
    if (lastMessage && lastMessage.includes('какое время и бокс')) {
        return `Записал! ✅\n📅 Завтра ${command}\n\nКстати, не хотите добавить полировку воском всего за 500₽? Это защитит кузов и придаст блеск.`;
    }
    
    if (lastMessage && lastMessage.includes('полировку воском')) {
         if(command.includes('да') || command.includes('хочу')) {
            return `Отлично, добавил полировку. Итоговая сумма: 2000₽. Напомню о записи за 2 часа.`;
         } else {
            return `Хорошо, оставил только мойку. Напомню о записи за 2 часа.`;
         }
    }

    return 'Я обрабатываю ваш запрос... (Это моковый ответ, симулирующий работу ИИ-Помощника)';
}


export function AIChatWidget({ initialThread }: AIChatWidgetProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>(initialThread.messages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);
  
  const handleSend = () => {
    if (input.trim() === '') return;
    WebApp.HapticFeedback.impactOccurred('light');

    const newMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      text: input.trim(),
      sender: 'client',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const currentInput = input.trim();
    setInput('');
    setIsTyping(true);
    setShowHints(false);

    // Mock AI response
    setTimeout(() => {
      const aiResponseText = getAIResponse(currentInput, updatedMessages);
      const aiResponse: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        text: aiResponseText,
        sender: 'ai_assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      WebApp.HapticFeedback.notificationOccurred('success');
    }, 1200);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  }

  const handleHintClick = (command: string) => {
    setInput(command);
    setShowHints(false);
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6" style={{color: 'var(--tg-theme-link-color)'}} />
            <span>Ваш AI Помощник</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'client' ? 'justify-end' : 'justify-start')}>
            {msg.sender === 'ai_assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    <Bot className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}} />
                </div>
            )}
            <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug whitespace-pre-wrap',
                msg.sender === 'client' 
                  ? 'rounded-br-none' 
                  : 'rounded-bl-none'
              )}
              style={{
                backgroundColor: msg.sender === 'client' ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-secondary-bg-color)',
                color: msg.sender === 'client' ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
              }}
              >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
             <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                <Bot className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}} />
             </div>
             <div className="px-4 py-3 rounded-2xl rounded-bl-none" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 bg-current rounded-full animate-bounce" />
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="p-2 border-t flex-col" style={{borderColor: 'var(--tg-theme-secondary-bg-color)'}}>
        {showHints && (
            <div className="w-full p-2 space-y-1">
                {commands.map(c => (
                    <button key={c.cmd} onClick={() => handleHintClick(c.cmd)} className="w-full text-left p-2 rounded-lg hover:bg-[var(--tg-theme-secondary-bg-color)] text-sm flex justify-between">
                        <span>{c.cmd}</span>
                        <span className="text-[var(--tg-theme-hint-color)]">{c.desc}</span>
                    </button>
                ))}
            </div>
        )}
        <div className="w-full flex justify-center py-1">
             <button onClick={() => setShowHints(s => !s)} className="flex items-center gap-1 text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                <span className="font-medium" style={{color: 'var(--tg-theme-link-color)'}}>{showHints ? 'Скрыть команды' : 'Показать команды'}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showHints && "rotate-180")} style={{color: 'var(--tg-theme-link-color)'}}/>
             </button>
        </div>
        <div className="flex items-center w-full gap-2 p-1 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спросите или введите команду..."
            className="flex-grow bg-transparent focus:outline-none px-2 py-1.5 text-sm w-full placeholder:text-[var(--tg-theme-hint-color)]"
            style={{color: 'var(--tg-theme-text-color)'}}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}
            aria-label="Отправить сообщение"
            >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function AIChatWidgetSkeleton() {
    return (
        <Card className="h-[500px] flex flex-col">
            <CardHeader><CardTitle><Skeleton className="h-6 w-56" /></CardTitle></CardHeader>
            <CardContent className="flex-grow p-4 space-y-4">
                <div className="flex justify-start"><Skeleton className="h-10 w-3/5 rounded-2xl" /></div>
                <div className="flex justify-end"><Skeleton className="h-12 w-1/2 rounded-2xl" /></div>
                <div className="flex justify-start"><Skeleton className="h-8 w-2/5 rounded-2xl" /></div>
            </CardContent>
            <CardFooter className="p-2 border-t" style={{borderColor: 'var(--tg-theme-secondary-bg-color)'}}>
                <Skeleton className="h-12 w-full rounded-lg" />
            </CardFooter>
        </Card>
    )
}