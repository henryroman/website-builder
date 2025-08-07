import { NextRequest, NextResponse } from 'next/server'
import { deploymentManager } from '@/lib/deployment/deployment-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')
    const userId = searchParams.get('userId')

    if (websiteId) {
      const history = await deploymentManager.getDeploymentHistory(websiteId)
      return NextResponse.json({
        success: true,
        deployments: history
      })
    }

    if (userId) {
      const stats = await deploymentManager.getDeploymentStats(userId)
      return NextResponse.json({
        success: true,
        stats
      })
    }

    return NextResponse.json(
      { error: 'Missing websiteId or userId parameter' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error fetching deployments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const deploymentConfig = await request.json()

    // Validate required fields
    if (!deploymentConfig.websiteId || !deploymentConfig.userId) {
      return NextResponse.json(
        { error: 'websiteId and userId are required' },
        { status: 400 }
      )
    }

    // Create deployment
    const deploymentId = await deploymentManager.createDeployment(deploymentConfig)

    // Execute deployment (in background)
    deploymentManager.executeDeployment(deploymentId).catch(error => {
      console.error('Background deployment failed:', error)
    })

    return NextResponse.json({
      success: true,
      deploymentId,
      message: 'Deployment started successfully'
    })

  } catch (error) {
    console.error('Error creating deployment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}