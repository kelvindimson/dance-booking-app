import "next-auth"

export interface AuthResult {
  success: boolean;
  user: User | null;
  message: string;
  code: 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'INVALID_CREDENTIALS' | 'SUCCESS';
}

// Enums
export type userStatusEnum = 'pending' | 'active' | 'inactive' | 'banned' | 'suspended' | 'deleted'
export type classStatusEnum = 'active' | 'cancelled' | 'completed' | 'scheduled' | 'postponed' | 'deleted'
export type bookingStatusEnum = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'refunded' | 'deleted'
export type entityTypeEnum = 'studio' | 'class' | 'instructor' | 'user'

declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      name?: string | null
      email: string
      image?: string | null
      status?: userStatusEnum | null
      phoneNumber?: string | null
      username?: string | null
      roles?: string[];
    },
    sessionToken: string,
    expires: Date;
  }

  export interface User {
    id: string
    email: string | null
    name: string | null
    emailVerified?: Date | null
    image: string | null
    password?: string | null
    status?: userStatusEnum | null
    phoneNumber: string | null
    phoneNumberVerified?: Date | null
    createdAt?: Date
    updatedAt?: Date | null
    deletedAt?: Date | null
    roles?: string[] | null
  }

  interface UserLite {
    id: string
    name?: string | null
    username?: string | null
    email: string
    status?: userStatusEnum | null
    phoneNumber?: string | null
  }
}

export interface Role {
  id: string;
  name: string
  description?: string | null;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface Studio {
  id: string;
  ownerId: string;
  name: string;
  handle: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo?: string | null;
  slug: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface Room {
  id: string;
  studioId: string;
  name: string;
  description?: string | null;
  capacity: number;
  amenities?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface InstructorProfile {
  id: string;
  userId: string;
  bio?: string | null;
  specialties?: string | null;
  certifications?: string | null;
  hourlyRate?: number | null;
  availability?: string | null; // JSON string
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface StudioInstructor {
  id: string;
  studioId: string;
  instructorProfileId: string;
  status: string;
  startDate: Date;
  endDate?: Date | null;
  contractTerms?: string | null; // JSON string
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface Class {
  id: string;
  studioId: string;
  roomId: string;
  primaryInstructorId: string;
  name: string;
  description?: string | null;
  type: string;
  level?: string | null;
  capacity: number;
  price: number;
  duration: number;
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  recurrencePattern?: string | null; // JSON string
  status: classStatusEnum;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface ClassInstructor {
  id: string;
  classId: string;
  assistantInstructorId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  status: bookingStatusEnum;
  paymentStatus: string;
  paymentAmount: number;
  paymentDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface ClassPackage {
  id: string;
  studioId: string;
  name: string;
  description?: string | null;
  numberOfClasses: number;
  price: number;
  validityPeriod: number;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface UserPackage {
  id: string;
  userId: string;
  packageId: string;
  remainingClasses: number;
  purchaseDate: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export interface MediaFile {
  id: string;
  entityType: entityTypeEnum;
  entityId: string;
  url: string;
  key: string;
  filename: string;
  contentType: string;
  size: number;
  width: number;
  height: number;
  altText?: string | null;
  isPrimary: boolean;
  order: number;
  metadata?: string | null; // JSON string
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}