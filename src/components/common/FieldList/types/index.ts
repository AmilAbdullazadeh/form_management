import { FormField } from "@/lib/redux/slices/apiSlice";

export interface FieldListProps {
    fields: FormField[];
    isViewOnly: boolean;
    onAddField: () => void;
    onDeleteField?: (fieldName: string) => void;
    onReorderFields?: (reorderedFields: FormField[]) => void;
    addButtonLabel?: string;
    emptyMessage?: string;
}