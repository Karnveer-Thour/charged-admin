// User types
export interface User {
  token?: string;
  id: string;
  name: string;
  email: string;
  role: "admin" | "support";
  createdAt: any;
  photo?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  error: string | null;
}

// Ride types
export type RideStatus = "pending" | "in-progress" | "completed" | "canceled";
export type RideType = "electric" | "regular" | "suv";

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id: string;
  ride_type_id: RideType;
  status: RideStatus;
  pickup_address: String;
  dropoff_address: String;
  distance_km: number; // in kilometers
  duration_minutes: number; // in minutes
  base_fare: number;
  started_at?: string;
  arrived_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  cancellation_fee: boolean;
  driverDistanceAtCancel?: number; // in meters
  rating: number;
  created_at: string;
}

// Rider types
export interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  rewardPoints: number;
  totalRides: number;
  created_at: string;
  lastRideDate?: string;
  photo?: string;
}

// Driver types
export interface Driver {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  car_type: RideType;
  license_plate: string;
  rating: number;
  total_rides: number;
  address?: Location;
  is_active: boolean;
  photo?: string;
  documents: DriverDocument[];
  vehicleDetails?: {
    make: string;
    model: string;
    color: string;
    year: number;
  };
}

export type DocumentType =
  | "driverLicense"
  | "vehicleInsurance"
  | "vehiclePermit"
  | "backgroundCheck"
  | "workEligibility"
  | "driverAbstract"
  | "vehicleDetails";

export type DocumentStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "expired"
  | "notSubmitted";

export interface DriverDocumentpayload {
  status: string;
  rejection_reason?: string;
  notes?: string;
}

export interface Driverstatuspayload {
  is_active: true | false;
}

export interface DriverDocument {
  id: string;
  document_type: DocumentType;
  status: DocumentStatus;
  uploaded_at?: string;
  updated_at?: string;
  expiry_date?: string;
  reviewed_by?: string;
  notes?: string;
  rejection_reason?: string | null;
  file_url?: string;
  user_id: string;
}

export interface requiredDocuments {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_required: boolean;
  user_type: string;
  created_at: string;
}

// Pricing types not required anymore replaced with ridetypes
export interface PricingRule {
  id: string;
  rideTypeId: RideType;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  surgeMultiplier: number;
  cancellationFee: number;
  refundEligibilityDistance: number; // in meters
  commissionPercentage: number; // percentage of driver earnings that go to the platform
  minimumBillableDistance: number; // kilometers included in base price (e.g., 2km)
  createdAt: string;
  updatedAt: string;
}

//Type of rides
export interface rideTypes {
  id: number;
  name: string;
  description: string;
  base_price: string;
  price_per_km: string;
  price_per_minute: string;
  min_fare: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cancel_fee: string;
  refund_distance_in_m: number;
  minimum_billable_distance: string;
  commission_percentage: string;
  keyword?: string;
  govt_tax_percentage: string;
}

// Dashboard statistics
export interface DashboardStats {
  rideCount: string;
  activeDrivers: string;
  totalRevenue: string;
  platformCommission: string;
  rideTypeCounts: {
    name: string;
    count: string;
  }[];
  recentRides?: Ride[];
}
