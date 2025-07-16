export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status?: UserStatus;
    avatar?: string;
    organization?: string;
    phoneNumber?: string;
    createdAt?: string;
    lastLogin?: string;
    jobTitle?: string;
    department?: string;
  }
  
  export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    PROJECT_MANAGER = 'project_manager',
    SUPERVISOR = 'supervisor',
    TECHNICIAN = 'technician',
    CONTRACTOR = 'contractor',
    CLIENT = 'client',
    GOVERNMENT = 'government',
    CALL_CENTER = 'call_center',
    AUDITOR = 'auditor',
    CITIZEN = 'citizen',
  }


  export interface Register {
    name: string;
    email: string;
    password: string;
    type: 'ADMIN' | 'PROJECT_MANAGER' | 'SUPERVISOR' | 'ADMIN';
    storeName?: string;
    storeDescription?: string; }
  
    export interface Login{
      email: string;
      password: string;
    }