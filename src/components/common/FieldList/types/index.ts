import { FormField } from "@/types/form";

export interface FieldListProps {
    fields: FormField[];
    isViewOnly: boolean;
    onAddField: () => void;
    onDeleteField?: (fieldId: string) => void;
    onReorderFields?: (reorderedFields: FormField[]) => void;
    addButtonLabel?: string;
    emptyMessage?: string;
}