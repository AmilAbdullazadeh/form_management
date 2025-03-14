import React from 'react';

import styles from './Skeleton.module.scss';

// Define the types of skeletons we support
export type SkeletonType = 'text' | 'title' | 'card' | 'circle' | 'custom';

// Define the sizes for text skeletons
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'full';

interface SkeletonProps {
  type?: SkeletonType;
  size?: SkeletonSize;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  count?: number;
}

/**
 * Skeleton component for loading states
 *
 * @param type - The type of skeleton (text, title, card, circle, custom)
 * @param size - The size of the skeleton (sm, md, lg, full)
 * @param width - Custom width (for custom type)
 * @param height - Custom height (for custom type)
 * @param className - Additional CSS class
 * @param style - Additional inline styles
 * @param count - Number of skeleton items to render
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  size = 'full',
  width,
  height,
  className = '',
  style = {},
  count = 1,
}) => {
  // Generate the appropriate CSS class based on type and size
  const getClassName = () => {
    let baseClass = styles.skeleton;

    if (type === 'custom') {
      return baseClass;
    }

    if (type === 'text' && size !== 'full') {
      return `${baseClass} ${styles['skeleton-text']} ${styles[`skeleton-text-${size}`]}`;
    }

    return `${baseClass} ${styles[`skeleton-${type}`]}`;
  };

  // Generate custom styles for the custom type
  const getStyles = () => {
    const customStyles: React.CSSProperties = { ...style };

    if (type === 'custom') {
      if (width) customStyles.width = width;
      if (height) customStyles.height = height;
    }

    return customStyles;
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={`${getClassName()} ${className}`} style={getStyles()} />
        ))}
      </>
    );
  }

  // Render a single skeleton
  return <div className={`${getClassName()} ${className}`} style={getStyles()} />;
};
