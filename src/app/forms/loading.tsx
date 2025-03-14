import React from 'react';

import { SkeletonFormList } from '@/components/common/Skeleton/Form/SkeletonFormList';

export default function Loading() {
  return (
    <main className="container">
      <div className="header">
        <h1>Form List</h1>
      </div>
      
      <SkeletonFormList />
    </main>
  );
} 