import React from 'react';

import { SkeletonCard } from '../Card/SkeletonCard';
import { SkeletonFormListProps } from '../types';

/**
 * @param count - Number of skeleton cards to display
 * @param className - Additional CSS class for the container
 * @param gridClassName - Additional CSS class for the grid
 */
export const SkeletonFormList: React.FC<SkeletonFormListProps> = ({
  count = 3,
  className = '',
  gridClassName = '',
}) => {
  return (
    <div className={className}>
      <div className={gridClassName || 'form-grid'}>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};
