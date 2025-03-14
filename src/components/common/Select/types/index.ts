export interface SelectConfig {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    className?: string;
    containerClassName?: string;
    options: Array<{ value: string; label: string }>;
}