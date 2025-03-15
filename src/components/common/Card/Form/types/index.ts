import { ReactNode } from "react";

import { Form } from "@/lib/redux/slices/apiSlice";

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger';

export type FormItem = Form;

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