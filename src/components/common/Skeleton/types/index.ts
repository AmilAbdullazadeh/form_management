import { CSSProperties } from "react";

// Define the types of skeletons we support
export type SkeletonType = 'text' | 'title' | 'card' | 'circle' | 'custom';

// Define the sizes for text skeletons
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'full';

export interface SkeletonProps {
  type?: SkeletonType;
  size?: SkeletonSize;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
  count?: number;
}