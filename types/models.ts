// Role Enum
export type Role = 'SuperAdmin' | 'Admin' | 'Editor' | 'Client';
export type Status = 'active' | 'inactive' | 'suspended';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  favicon?: string;
  domain?: string;
  subdomain?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  language?: string;
  plan: 'Free' | 'Starter' | 'Business' | 'Enterprise';
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  companyId: string;
  name: string;
  email: string;
  photo?: string;
  role: Role;
  status: Status;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Portfolio {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  client?: string;
  category?: string;
  description: string;
  challenge?: string;
  solution?: string;
  technologies?: string[];
  gallery?: string[];
  cover?: string;
  website?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  benefits?: string[];
  priceFrom?: number;
  featured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  companyId: string;
  name: string;
  company?: string;
  photo?: string;
  rating: number; // 1-5
  comment: string;
  featured: boolean;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  companyId: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface Blog {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  seo?: SEO;
}

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  origin?: string;
  createdAt: Date;
}

export interface Quote {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  budget?: string;
  deadline?: string;
  description: string;
  attachments?: string[];
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Page {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  content: string;
  seo?: SEO;
  published: boolean;
  order: number;
}

export interface Hero {
  id: string;
  companyId: string;
  title: string;
  subtitle?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  background?: string;
  video?: string;
}

export interface Settings {
  id: string;
  companyId: string;
  companyName: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  github?: string;
  analytics?: string;
  pixel?: string;
  seo?: SEO;
}

export interface Technology {
  id: string;
  companyId: string;
  name: string;
  icon?: string;
  color?: string;
  website?: string;
}

export interface Category {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  openGraphImage?: string;
  twitterCardType?: string;
  canonicalUrl?: string;
}
