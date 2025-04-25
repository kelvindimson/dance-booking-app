'use client';

import { useState } from 'react';

export default function DbTestButton() {
  const [result, setResult] = useState<null | {
    status: string;
    message: string;
    timestamp: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/db-status');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: 'error',
        message: `Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Database Connection Test</h2>
      
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${
          result.status === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Time:</strong> {result.timestamp}</p>
        </div>
      )}
    </div>
  );
}