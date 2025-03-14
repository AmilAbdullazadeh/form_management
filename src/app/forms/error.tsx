'use client';

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="container">
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>We encountered an error while loading the forms.</p>
        <div className="error-details">
          <p>
            <strong>Error:</strong> {error.message}
          </p>
          {error.digest && (
            <p>
              <strong>Digest:</strong> {error.digest}
            </p>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => reset()} style={{ marginTop: '1rem' }}>
          Try again
        </button>
      </div>
    </main>
  );
}
