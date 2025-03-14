import { ReactNode } from "react";

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

export interface FormItem {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    fields?: number;
    submissions?: number;
  }

export interface FormCardProps {
  title: string;
  subtitle?: string;
  badge?: Array<{
    text: string;
    variant: BadgeVariant;
  }>;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  metadata?: Array<{
    icon?: ReactNode;
    text: string;
  }>;
  actions?: ReactNode;
}