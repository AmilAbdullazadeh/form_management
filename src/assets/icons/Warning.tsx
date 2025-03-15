import { IconProps } from "@/types/icon";

export function Warning({
  fill = '#fff',
  stroke = '#FF8983',
  className = '',
  onClick = () => {},
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={fill}
      className={className}
      onClick={onClick}
    >
      <ellipse cx="9.99984" cy="14.1666" rx="0.833333" ry="0.833333" fill={fill} />
       <path d="M10 7.49997V11.6666M3.60665 17.5H16.3935C17.8705 17.5 18.8042 15.9527 18.0869 14.6937L11.6934 3.4716C10.9554 2.17613 9.04479 2.17613 8.30674 3.4716L1.91331 14.6937C1.196 15.9527 2.12963 17.5 3.60665 17.5Z" 
        stroke={stroke} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
       />
    </svg>
  );
}
