import { IconProps } from "@/types/icon";

export function Plus({
  fill = '',
  stroke = '#fff',
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
        <path 
            d="M12 6V18M18 12L6 12"
            stroke={stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
  );
}
