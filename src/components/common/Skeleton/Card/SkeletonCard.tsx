import React from 'react';

import { Skeleton } from '../Skeleton';

interface SkeletonCardProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SkeletonCard component for form card loading states
 * Displays a skeleton version of a form card with title, description, and action button
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', style = {} }) => {
  return (
    <div className={`card ${className}`} style={style}>
      <Skeleton type="title" />
      <Skeleton type="text" size="lg" />
      <Skeleton type="text" />
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton type="text" size="sm" />
      </div>
    </div>
  );
};
