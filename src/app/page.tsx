import React from 'react';

import { Skeleton } from '@/components/common/Skeleton/Skeleton';

export default function HomePage() {
  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Skeleton type="title" style={{ margin: '0 auto', width: '50%' }} />
        <Skeleton type="text" size="md" style={{ margin: '1rem auto' }} />
        
        {/* Skeleton cards to indicate content is loading */}
        <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
          <Skeleton type="card" count={2} />
        </div>
      </div>
    </main>
  );
} 