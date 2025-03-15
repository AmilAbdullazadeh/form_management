import React from 'react';

import { Skeleton } from '../Skeleton';

import styles from './SkeletonCard.module.scss';
import { SkeletonCardProps } from './types';


export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', style = {} }) => {
  return (
    <div className={`card ${className}`} style={style}>
      <Skeleton type="title" />
      <Skeleton type="text" size="lg" />
      <Skeleton type="text" />
      <div className={styles.action}>
        <Skeleton type="text" size="sm" />
      </div>
    </div>
  );
}; 