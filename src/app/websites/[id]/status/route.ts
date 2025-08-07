import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const websiteId = params.id

    // Get website with latest deployment
    const website = await db.website.findUnique({
      where: { id: websiteId },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      )
    }

    const latestDeployment = website.deployments[0]

    return NextResponse.json({
      success: true,
      website: {
        id: website.id,
        name: website.name,
        subdomain: website.subdomain,
        status: website.status,
        deployment: latestDeployment ? {
          status: latestDeployment.status,
          url: latestDeployment.url,
          deployedAt: latestDeployment.deployedAt,
          logs: latestDeployment.logs
        } : null
      }
    })

  } catch (error) {
    console.error('Error fetching website status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}