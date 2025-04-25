// lib/db-test.ts
import { dbConnection } from '@/db';
import { sql } from 'drizzle-orm';

export async function testDbConnection() {
  try {
    // Simple query to test connection
    const result = await dbConnection.execute(sql`SELECT 1 as connected`);
    
    if (result && result[0]?.connected === 1) {
      return {
        status: 'success',
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Unexpected query result');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      status: 'error',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
}