import { IconProps } from "@/types/icon";

export function Close({
  fill = '#fff',
  stroke = '#495057',
  className = '',
  onClick = () => {},
}: IconProps) {
  return (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        >
            <path d="M16.2431 7.75738L7.75781 16.2427M16.2431 16.2426L7.75781 7.75732" 
                stroke={stroke} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
    </svg>
  );
}
