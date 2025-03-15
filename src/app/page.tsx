import { Metadata } from 'next';

import { Skeleton } from '@/components/common/Skeleton/Skeleton';

// meta data
export const metadata: Metadata = {
  title: 'Form Management',
  description: 'A simple form management application',
};

export default function HomePage() {

  
  return (
    <main className="container">
      <div className='mt-4 text-center'>
        <Skeleton type="title" className='mx-auto w-1/2' />
        <Skeleton type="text" size="md" className='mt-4 mx-auto' />
        
        <div className="mt-6 max-w-600px mx-auto">
          <Skeleton type="card" count={2} />
        </div>
      </div>
    </main>
  );
} 