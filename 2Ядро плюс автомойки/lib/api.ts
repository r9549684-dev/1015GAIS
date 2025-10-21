
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import startOfDay from 'date-fns/startOfDay';
import getDay from 'date-fns/getDay';
import ru from 'date-fns/locale/ru';
import { Booking, Client, Resource, Service, WashBox } from '../types';

// --- MOCK DATA GENERATION ---

const clients: Client[] = [
    { id: '1', name: 'Иван Петров', phone: '+7 (926) 123-45-67', photo: 'https://i.pravatar.cc/150?u=1', tags: ['VIP', 'Постоянный'], total_revenue: 15400, bookings_count: 8, first_visit: subDays(new Date(), 90).toISOString(), last_visit: subDays(new Date(), 10).toISOString(), cars: [{ id: 'c1', brand: 'Toyota', model: 'Camry', year: 2021, plate_number: 'A123BC777', color: 'Черный', body_type: 'sedan' }], notes: 'Предпочитает кофе без сахара.\nНе любит светскую беседу.', preferred_master_id: 'm1', alerts: 'Аллергия на цитрусовые ароматизаторы' },
    { id: '2', name: 'Анна Сидорова', phone: '+7 (916) 765-43-21', photo: 'https://i.pravatar.cc/150?u=2', tags: ['Новый'], total_revenue: 3600, bookings_count: 2, first_visit: subDays(new Date(), 25).toISOString(), last_visit: subDays(new Date(), 5).toISOString(), cars: [{ id: 'c2', brand: 'BMW', model: 'X5', year: 2022, plate_number: 'B456CA799', color: 'Синий', body_type: 'suv' }], notes: '', preferred_master_id: 'm2' },
    { id: '3', name: 'Олег Смирнов', phone: '+7 (903) 555-88-99', photo: 'https://i.pravatar.cc/150?u=3', tags: [], total_revenue: 7200, bookings_count: 4, first_visit: subDays(new Date(), 60).toISOString(), last_visit: subDays(new Date(), 35).toISOString(), cars: [], notes: 'Всегда приезжает с опозданием на 10 минут.' },
];

const resources: Resource[] = [
    { id: 'm1', name: 'Анна', type: 'master', photo: 'https://i.pravatar.cc/150?u=m1', specialization: ['Стрижки', 'Окрашивание'], status: 'active', commission_percent: 50 },
    { id: 'm2', name: 'Виктор', type: 'master', photo: 'https://i.pravatar.cc/150?u=m2', specialization: ['Детейлинг', 'Полировка'], status: 'active', commission_percent: 40 },
    { id: 'm3', name: 'Светлана', type: 'master', photo: 'https://i.pravatar.cc/150?u=m3', specialization: ['Маникюр'], status: 'inactive' },
    { id: 'b1', name: 'Бокс №1', type: 'box', photo: '', specialization: [], status: 'active' },
    { id: 'b2', name: 'Бокс №2', type: 'box', photo: '', specialization: [], status: 'active' },
];

const services: Service[] = [
    { id: 's1', name: 'Комплексная мойка', price: 1500, duration: 60 },
    { id: 's2', name: 'Детейлинг салона', price: 5000, duration: 240, related_alerts: ['ароматизаторы'] },
    { id: 's3', name: 'Полировка воском', price: 800, duration: 30 },
    { id: 's4', name: 'Женская стрижка', price: 2000, duration: 90 },
    { id: 's5', name: 'Окрашивание', price: 4500, duration: 180, related_alerts: ['аммиак', 'краска'] },
];

const bookings: Booking[] = Array.from({ length: 50 }).map((_, i) => {
    const client = clients[i % clients.length];
    const service = services[i % services.length];
    const master = resources.filter(r => r.type === 'master')[i % resources.filter(r => r.type === 'master').length];
    const date = addDays(startOfDay(new Date()), Math.floor(Math.random() * 20) - 10);
    const hour = Math.floor(Math.random() * 10) + 9;
    const start_time = new Date(date.setHours(hour, 0, 0, 0));
    const end_time = new Date(start_time.getTime() + service.duration * 60000);
    const statuses: Booking['status'][] = ['confirmed', 'completed', 'pending', 'cancelled'];

    return {
        id: `booking-${i}`,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
        status: statuses[i % statuses.length],
        client: { id: client.id, name: client.name, photo: client.photo },
        service: { id: service.id, name: service.name, price: service.price },
        master: { id: master.id, name: master.name },
        duration: service.duration,
    };
});

// --- AXIOS & MOCK ADAPTER SETUP ---

const api = axios.create({ baseURL: '/api' });

const mock = new MockAdapter(api, { delayResponse: 500 });

// --- MOCK API ENDPOINTS ---

mock.onGet('/dashboard').reply(200, {
    problems: { unconfirmed_bookings: 3, unpaid_bookings: 2 },
    today: { revenue: 8500, bookings: 5, clients: 1, no_shows: 0 },
    weather: {
        current: { temp: 18, condition: 'Переменная облачность', wind_speed: 5 },
        forecast: [
            { date: format(new Date(), 'dd MMM', { locale: ru }), condition: 'Солнечно', temp_day: 22 },
            { date: format(addDays(new Date(), 1), 'dd MMM', { locale: ru }), condition: 'Дождь', temp_day: 15 },
            { date: format(addDays(new Date(), 2), 'dd MMM', { locale: ru }), condition: 'Облачно', temp_day: 19 },
        ],
        ai_analysis: { impact_on_business: 'Завтра дождь — загрузка автомоек вырастет на 40%, подготовьте персонал.' },
    },
    upcoming: bookings.filter(b => new Date(b.start_time) > new Date()).sort((a,b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).slice(0, 3),
    wash_boxes: [
        { id: 'wb1', name: 'Бокс №1', type: 'manual', masters: [resources[1]], status: 'busy', current_booking: { client_name: 'Анна С.', service_name: 'Детейлинг', end_time: new Date(new Date().getTime() + 60 * 60000).toISOString() } },
        { id: 'wb2', name: 'Бокс №2', type: 'manual', masters: [resources[1]], status: 'free', current_booking: null },
        { id: 'wb3', name: 'Бокс №3 (Автомат)', type: 'automatic', masters: [], status: 'free', current_booking: null },
        { id: 'wb4', name: 'Бокс №4', type: 'manual', masters: [], status: 'unavailable', current_booking: null },
    ] as WashBox[],
    ai_insights: {
        revenue_forecast: 'Прогноз выручки на конец месяца: 285 000 ₽ (+12%)',
        recommendations: ['Среда 18:00-20:00 загружена на 30% → запустите акцию "Счастливые часы -15%".', 'Клиент Иван Петров не был 35 дней → отправьте скидку 10%.', 'Шиномонтажный сезон близко, проверьте запасы расходников.']
    },
    ai_chat_thread: {
        id: 'chat1', messages: [{ id: 'msg1', text: 'Здравствуйте! Я ваш AI-Помощник. Я могу отвечать на ваши команды, а также самостоятельно общаюсь с клиентами в Telegram-боте, обрабатывая текстовые и голосовые сообщения для записи на услуги.', sender: 'ai_assistant', timestamp: new Date().toISOString() }]
    }
});

mock.onGet('/clients').reply(200, { clients });
mock.onGet(/\/clients\/\d+$/).reply(config => {
    const id = config.url?.split('/').pop();
    const client = clients.find(c => c.id === id);
    return client ? [200, client] : [404, { message: 'Client not found' }];
});
mock.onGet(/\/clients\/\d+\/bookings$/).reply(config => {
    const id = config.url?.split('/')[2];
    const clientBookings = bookings.filter(b => b.client.id === id);
    return [200, { bookings: clientBookings }];
});
mock.onGet('/clients/segments').reply(200, {
    segments: [
        { status: 'new', count: 8 },
        { status: 'regular', count: 25 },
        { status: 'vip', count: 5 },
        { status: 'sleeping', count: 3 },
    ]
});

mock.onPost('/clients').reply(201, {});
mock.onPut(/\/clients\/\d+$/).reply(200, {});


mock.onGet('/bookings').reply(config => {
    const date = config.params.date;
    const filtered = bookings.filter(b => format(new Date(b.start_time), 'yyyy-MM-dd') === date);
    return [200, { bookings: filtered }];
});
mock.onPost('/bookings').reply(201, {});

mock.onGet('/analytics').reply(200, {
    revenue: { labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], data: [12000, 15000, 11000, 18000, 22000, 25000, 19000] },
    bookings: { labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], data: [8, 10, 7, 12, 15, 18, 13] },
    marketing_triggers: [
        { id: 't1', event: 'Не был 30 дней (Спящий)', action: 'Скидка 15%', result: 'Возврат 25% клиентов', active: true },
        { id: 't2', event: 'День рождения', action: 'Подарок/скидка 15%', result: 'Лояльность +30%', active: true },
        { id: 't3', event: 'После мойки 14 дней', action: '"Ждём вас снова"', result: 'Повторная запись 20%', active: false },
        { id: 't4', event: 'Не был 90+ дней (Потерян)', action: 'Возвращение (скидка 20%)', result: 'Возврат 5% клиентов', active: true },
        { id: 't5', event: '10-й визит', action: 'Бонусы x2', result: 'Лояльность +50%', active: true },
    ],
    content_suggestions: [
        { id: 'c1', platform: 'instagram', type: 'story', generated_text: '✨ Преображение Toyota Camry! Полный детейлинг за 4 часа. Результат говорит сам за себя 🚗💎 Записывайтесь: @ваш_бот' },
        { id: 'c2', platform: 'vk', type: 'post', generated_text: '📢 Напоминаем, что у нас действует акция "Счастливые часы"! С 12:00 до 16:00 в будни скидка 15% на комплексную мойку. Успейте записаться!' },
        { id: 'c3', platform: 'telegram', type: 'post', generated_text: '⚡️ Только до конца недели! При заказе детейлинга салона — озонирование в подарок! 🎁 Дышите свежим воздухом в вашем авто.' },
    ],
});

mock.onGet('/settings').reply(200, {
    business: { name: 'Detailing Pro', address: 'ул. Ленина, 25', phone: '+7 (999) 123-45-67', work_hours: '10:00 - 22:00' },
    payment: { gateways: { yukassa: { enabled: true }, tinkoff: { enabled: false }, sbp: { enabled: true } } },
    integrations: {
        social_media: { instagram: { status: 'connected' }, vk: { status: 'disconnected' } },
        external_services: { sms_ru: { status: 'active' }, open_weather_map: { status: 'active' } },
        ai_engine: { status: 'active', llm_runtime: 'Mistral 7B' },
        knowledge_base: { status: 'connected', provider: 'ChromaDB' },
    },
    infrastructure: { nginx: { status: 'operational' }, cloudflare: { status: 'operational' }, prometheus: { status: 'degraded' }, sentry: { status: 'operational' } },
    active_modules: ['carwash']
});

mock.onGet('/billing').reply(200, {
    current_plan_id: 'biz',
    usage: { masters: { current: 3, limit: 10 }, storage_mb: { current: 1250, limit: 5000 } },
    available_plans: [
        { id: 'start', name: 'СТАРТ', price: 590, is_recommended: false, features: ['До 120 записей/месяц', 'До 3 мастеров/боксов', 'Онлайн-оплата (ЮKassa, СБП)', 'Базовая аналитика', '50 SMS включено', '2 ГБ хранилища'], modules: [] },
        { id: 'biz', name: 'БИЗНЕС', price: 890, is_recommended: true, features: ['Безлимит записей', 'До 10 мастеров/боксов', 'Полная финансовая аналитика', 'Программа лояльности', 'AI-аналитик и AI-маркетолог', 'Складской учёт', '100 SMS включено', '5 ГБ хранилища'], modules: ['carwash'] },
        { id: 'pro', name: 'PRO', price: 1390, is_recommended: false, features: ['Всё из БИЗНЕС +', 'Безлимит мастеров', 'Несколько филиалов', 'API для интеграций', 'Персональный менеджер', '10 ГБ хранилища'], modules: ['carwash'] },
    ],
    addons: [
        { name: '100 SMS', type: 'sms', price: 200 },
        { name: '+5 ГБ Хранилища', type: 'storage', price: 200 },
    ]
});


mock.onGet('/finance').reply(200, { transactions: [{id: 't1', type: 'income', description: 'Оплата записи #1234', date: new Date().toISOString(), amount: 1500}, {id: 't2', type: 'expense', description: 'Закупка автохимии', date: subDays(new Date(), 1).toISOString(), amount: 3200}]});
mock.onGet('/inventory').reply(200, { items: [{id: 'i1', name: 'Шампунь-концентрат', type: 'consumable', stock: 15, low_stock_threshold: 10, unit: 'л'}, {id: 'i2', name: 'Ароматизатор "Ваниль"', type: 'product', stock: 8, low_stock_threshold: 5, unit: 'шт'}]});
mock.onGet('/reviews').reply(200, { reviews: [{id: 'r1', client_name: 'Иван Петров', client_photo: 'https://i.pravatar.cc/150?u=1', date: subDays(new Date(), 2).toISOString(), rating_master: 5, rating_service: 5, rating_atmosphere: 4, text: 'Отличная мойка, быстро и качественно!', status: 'published'}, {id: 'r2', client_name: 'Петр', client_photo: 'https://i.pravatar.cc/150?u=4', date: new Date().toISOString(), rating_master: 4, rating_service: 5, rating_atmosphere: 5, text: '', status: 'pending'}]});

mock.onGet('/resources').reply(200, { resources });
mock.onGet(/\/resources\/\d+$/).reply(config => {
    const id = config.url?.split('/').pop();
    const resource = resources.find(r => r.id === id);
    return resource ? [200, resource] : [404, { message: 'Resource not found' }];
});
mock.onPost('/resources').reply(201, {});
mock.onPut(/\/resources\/\d+$/).reply(200, {});

mock.onGet('/services').reply(200, { services });

// Pass through all other requests
mock.onAny().passThrough();

// Add a response interceptor to extract the data
api.interceptors.response.use(response => response.data);


export { api };