import type { User as TelegramUser } from '@twa-dev/types';

export type User = TelegramUser;

export interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  client: {
    id: string;
    name: string;
    photo: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
  };
  master: {
    id: string;
    name: string;
  };
  duration?: number;
}

export interface ClientCar {
    id: string;
    brand: string;
    model: string;
    year: number;
    plate_number: string;
    color: string;
    body_type: 'sedan' | 'suv' | 'crossover' | 'minivan';
}
  
export interface Client {
  id: string;
  name: string;
  phone: string;
  photo: string;
  tags: string[];
  total_revenue: number;
  bookings_count: number;
  first_visit: string;
  last_visit: string;
  cars: ClientCar[];
  notes: string;
  preferred_master_id?: string;
  alerts?: string;
}

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    wind_speed: number;
  };
  forecast: {
    date: string;
    condition: string;
    temp_day: number;
  }[];
  ai_analysis: {
    impact_on_business: string;
  };
}

export interface WashBox {
  id: string;
  name: string;
  type: 'automatic' | 'manual';
  masters: { id: string, name: string }[];
  status: 'free' | 'busy' | 'unavailable';
  current_booking: {
    client_name: string;
    service_name: string;
    end_time: string;
  } | null;
}

export interface AIChatMessage {
  id: string;
  text: string;
  sender: 'client' | 'ai_assistant';
  timestamp: string;
}

export interface AIChatThread {
  id: string;
  messages: AIChatMessage[];
}

export interface DashboardData {
  problems: {
    unconfirmed_bookings: number;
    unpaid_bookings: number;
  };
  today: {
    revenue: number;
    bookings: number;
    clients: number;
    no_shows: number;
  };
  weather: WeatherData;
  upcoming: Booking[];
  wash_boxes: WashBox[];
  ai_insights: {
    revenue_forecast: string;
    recommendations: string[];
  };
  ai_chat_thread: AIChatThread;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface MarketingTrigger {
  id: string;
  event: string;
  action: string;
  result: string;
  active: boolean;
}

export type AIContentSuggestionPlatform = 'instagram' | 'vk' | 'telegram';

export interface AIContentSuggestion {
  id: string;
  platform: AIContentSuggestionPlatform;
  type: 'post' | 'story';
  generated_text: string;
}

export interface AnalyticsData {
  revenue: ChartData;
  bookings: ChartData;
  marketing_triggers: MarketingTrigger[];
  content_suggestions: AIContentSuggestion[];
}

export type ClientLoyaltyStatus = 'new' | 'regular' | 'vip' | 'sleeping' | 'lost';

export interface ClientSegment {
  status: ClientLoyaltyStatus;
  count: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  date: string;
  amount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'consumable' | 'product';
  stock: number;
  low_stock_threshold: number;
  unit: string;
}

export interface Review {
  id: string;
  client_name: string;
  client_photo: string;
  date: string;
  rating_master: number;
  rating_service: number;
  rating_atmosphere: number;
  text: string;
  status: 'pending' | 'published' | 'hidden';
}

export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
    related_alerts?: string[];
}

export interface Resource {
    id: string;
    name: string;
    type: 'master' | 'box' | 'equipment';
    photo: string;
    specialization: string[];
    status: 'active' | 'inactive';
    commission_percent?: number;
}

export type Niche = 'carwash' | 'salon' | 'autoservice';

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    is_recommended: boolean;
    features: string[];
    modules: Niche[];
}

export interface AddonPackage {
    name: string;
    type: 'sms' | 'storage';
    price: number;
}

export interface BillingData {
    current_plan_id: string;
    usage: {
        masters: { current: number; limit: number | 'unlimited' };
        storage_mb: { current: number; limit: number | 'unlimited' };
    };
    available_plans: SubscriptionPlan[];
    addons: AddonPackage[];
}

export interface SettingsData {
    business: {
        name: string;
        address: string;
        phone: string;
        work_hours: string;
    };
    payment: {
        gateways: {
            yukassa: { enabled: boolean; };
            tinkoff: { enabled: boolean; };
            sbp: { enabled: boolean; };
        };
    };
    integrations: {
        social_media: {
            instagram: { status: 'connected' | 'disconnected' };
            vk: { status: 'connected' | 'disconnected' };
        };
        external_services: {
            sms_ru: { status: 'active' | 'inactive' };
            open_weather_map: { status: 'active' | 'inactive' };
        };
        ai_engine: {
            status: 'active' | 'inactive';
            llm_runtime: string;
        };
        knowledge_base: {
            status: 'connected' | 'disconnected';
            provider: string;
        };
    };
    infrastructure: {
        nginx: { status: 'operational' | 'degraded' };
        cloudflare: { status: 'operational' | 'degraded' };
        prometheus: { status: 'operational' | 'degraded' };
        sentry: { status: 'operational' | 'degraded' };
    };
    active_modules: Niche[];
}