import { FormItem } from "../../types";

export interface FormCardListProps {
  forms: FormItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
}
