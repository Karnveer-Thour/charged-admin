// User types
export interface User {
  token?: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support';
  createdAt: any;
  photo?: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  error: string | null;
}

// Ride types
export type RideStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type RideType = 'electric' | 'regular' | 'suv';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  rideType: RideType;
  status: RideStatus;
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number; // in kilometers
  duration: number; // in minutes
  fare: number;
  startTime?: string;
  endTime?: string;
  cancelTime?: string;
  cancelReason?: string;
  refunded: boolean;
  driverDistanceAtCancel?: number; // in meters
  pointsAwarded: number;
  createdAt: string;
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
  user_id: string;
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
  | 'driverLicense'
  | 'vehicleInsurance'
  | 'vehiclePermit'
  | 'backgroundCheck'
  | 'workEligibility'
  | 'driverAbstract'
  | 'vehicleDetails';

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'notSubmitted';

export interface DriverDocument {
  id: string;
  type: DocumentType;
  status: DocumentStatus;
  dateSubmitted?: string;
  dateReviewed?: string;
  expiryDate?: string;
  reviewedBy?: string;
  notes?: string;
  fileUrl?: string;
}

// Pricing types
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

// Dashboard statistics
export interface DashboardStats {
  totalRides: number;
  activeDrivers: number;
  totalRevenue: number;
  totalCommission: number; // Total commission earned from rides
  commissionRate: number; // Current average commission rate
  totalUsers: number;
  totalRefunds: number;
  totalPoints: number;
  recentRides: Ride[];
  ridesByType: {
    type: string;
    count: number;
  }[];
} 