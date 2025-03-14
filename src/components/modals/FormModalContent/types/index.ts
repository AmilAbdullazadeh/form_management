import { FormValues } from "@/types/form";

export interface FormModalContentProps {
        values: FormValues;
        errors: Record<string, string>;
        handleChange: any;
        isViewOnly: boolean;
        formFields: any[];
        isUpdateMode: boolean;
        initialForm: any;
        handleOpenFieldModal: () => void;
        submitError: string | null;
}
