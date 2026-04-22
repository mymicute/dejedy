export type PropertyType = 'house' | 'apartment' | 'villa' | 'office' | 'land';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'pending' | 'sold' | 'rented';
export type UserRole = 'buyer' | 'agent' | 'admin';

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  property_type: PropertyType;
  listing_type: ListingType;
  status: PropertyStatus;
  address: string;
  city: string;
  state?: string;
  country: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  amenities?: string[];
  images?: string[];
  video_url?: string;
  virtual_tour_url?: string;
  year_built?: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  phone?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  user_id: string;
  agent_id: string;
  booking_type: 'inspection' | 'virtual_tour';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  scheduled_at: string;
  notes?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}
