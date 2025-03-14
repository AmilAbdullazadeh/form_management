export interface FormItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fields?: number;
  submissions?: number;
}

export interface FormItemCardProps {
  form: FormItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export interface FormItemCardProps {
  form: FormItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}