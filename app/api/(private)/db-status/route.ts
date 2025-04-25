// app/api/db-test/route.ts
import { NextResponse } from 'next/server';
import { testDbConnection } from '@/utils/db-test';

export async function GET() {
  try {
    const result = await testDbConnection();
    
    if (result.status === 'success') {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      status: 'error',
      message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}