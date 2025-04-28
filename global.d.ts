import "next-auth"
export interface AuthResult {
    success: boolean;
    user: User | null;
    message: string;
    code: 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'INVALID_CREDENTIALS' | 'SUCCESS';
}

export type userStatusEnum = 'pending' | 'active' | 'inactive' | 'banned' | 'suspended' | 'deleted'




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
    },
    sessionToken: string,
    userId: string,
    expires: Date;
    roles?: string[];
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