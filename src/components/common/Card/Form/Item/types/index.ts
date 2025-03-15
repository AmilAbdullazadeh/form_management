import { FormItem } from "../../types";

export interface FormItemCardProps {
  form: FormItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}