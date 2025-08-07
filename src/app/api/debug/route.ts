import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    NOTION_TOKEN: process.env.NOTION_TOKEN ? '***' + process.env.NOTION_TOKEN.slice(-4) : 'NOT_SET',
    NOTION_CUSTOMERS_DB_ID: process.env.NOTION_CUSTOMERS_DB_ID || 'NOT_SET',
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
  }

  return NextResponse.json({
    environment: envVars,
    message: 'Environment variables check'
  })
}