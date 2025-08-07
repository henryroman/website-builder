import { NextRequest, NextResponse } from 'next/server'
import { deploymentManager } from '@/lib/deployment/deployment-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deploymentId = params.id
    const deployment = await deploymentManager.getDeploymentStatus(deploymentId)

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      deployment
    })

  } catch (error) {
    console.error('Error fetching deployment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deploymentId = params.id
    const { action } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'cancel':
        await deploymentManager.cancelDeployment(deploymentId)
        result = { success: true, message: 'Deployment cancelled successfully' }
        break
      
      case 'retry':
        result = await deploymentManager.retryDeployment(deploymentId)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Error managing deployment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}