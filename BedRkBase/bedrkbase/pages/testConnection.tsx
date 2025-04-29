import React, { useEffect, useState } from 'react';
import { testConnection } from '../lib/supabaseClient';
import axios, { AxiosError } from 'axios';
import logger from '../lib/logger';
import { ExternalServiceError } from '../lib/types/errors';

/**
 * Test Connection Page 
 * 
 * Tests connections to various services like Supabase, PostgreSQL, and the backend API
 */
export default function TestConnectionPage(): JSX.Element {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [postgresStatus, setPostgresStatus] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnections() {
      // Check Supabase
      try {
        const result = await testConnection();
        setConnectionStatus(result.success ? 'Connected' : `Failed to connect: ${result.error}`);
      } catch (error) {
        logger.error('Supabase connection test error', { error });
        setConnectionStatus('Failed to connect: Unexpected error');
      }

      // Check Postgres using our frontend API route (mock mode)
      try {
        const resp = await fetch('/api/testPostgres');
        const data = await resp.json();
        
        if (!resp.ok) {
          setPostgresStatus(`DB Mock: ${data.message || ''}`);
        } else {
          setPostgresStatus(`${data.message || 'Mock mode'}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Postgres mock test error', { error: errorMessage });
        setPostgresStatus(`Unable to connect to mock: ${errorMessage}`);
      }
      
      // Check Backend API
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const resp = await axios.get(`${backendUrl}/health`);
        setBackendStatus(`Backend API is up (${resp.data.status})`);
        
        // Optionally check backend database connection
        try {
          const dbResp = await axios.get(`${backendUrl}/health/db`);
          if (dbResp.data.status === 'ok') {
            setPostgresStatus(`PostgreSQL is up (via Backend API)`);
          }
        } catch (error) {
          // If backend DB check fails, we'll keep the mock status
          logger.debug('Backend DB check failed, using mock status');
        }
      } catch (error) {
        const errorMessage = error instanceof AxiosError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : String(error);
            
        logger.error('Backend API connection test error', { error: errorMessage });
        setBackendStatus(`Backend API unavailable: ${errorMessage}`);
      }
    }
    
    checkConnections();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Connection Tests</h1>
      
      <div className="mb-4 p-3 border rounded">
        <h2 className="text-xl font-semibold">Supabase Connection</h2>
        {connectionStatus === null ? (
          <p className="text-gray-500">Testing connection...</p>
        ) : (
          <p className={connectionStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'}>
            {connectionStatus}
          </p>
        )}
      </div>

      <div className="mb-4 p-3 border rounded">
        <h2 className="text-xl font-semibold">PostgreSQL Connection</h2>
        {postgresStatus === null ? (
          <p className="text-gray-500">Testing PostgreSQL connection...</p>
        ) : (
          <p className={postgresStatus.includes('Down') ? 'text-red-500' : 'text-green-500'}>
            {postgresStatus}
          </p>
        )}
      </div>
      
      <div className="mb-4 p-3 border rounded">
        <h2 className="text-xl font-semibold">Backend API Status</h2>
        {backendStatus === null ? (
          <p className="text-gray-500">Testing backend connection...</p>
        ) : (
          <p className={backendStatus.includes('unavailable') ? 'text-red-500' : 'text-green-500'}>
            {backendStatus}
          </p>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Note: Database functionality has been moved to the backend service.</p>
        <p>The frontend now uses mock data for database tests.</p>
      </div>
    </div>
  );
}
