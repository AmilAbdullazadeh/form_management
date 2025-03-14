import React from 'react';

import { Skeleton } from '@/components/common/Skeleton/Skeleton';

export default function HomePage() {
  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Skeleton type="title" className='mx-auto w-1/2' />
        <Skeleton type="text" size="md" className='mt-4 mx-auto' />
        
        <div className="mt-6 max-w-600px mx-auto">
          <Skeleton type="card" count={2} />
        </div>
      </div>
    </main>
  );
} 