import React from 'react';

import { SkeletonCard } from '../Card/SkeletonCard';
import { SkeletonFormListProps } from '../types';

export const SkeletonFormList: React.FC<SkeletonFormListProps> = ({
  count = 9,
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
