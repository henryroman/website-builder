import { NextRequest, NextResponse } from 'next/server'
import { templateManager } from '@/lib/templates/template-manager'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const websiteData = await request.json()

    // Validate required fields
    if (!websiteData.business || !websiteData.content || !websiteData.designPreferences) {
      return NextResponse.json(
        { error: 'Missing required website data' },
        { status: 400 }
      )
    }

    const generatedWebsite = await templateManager.generateWebsite(
      templateId,
      websiteData
    )

    return NextResponse.json({
      success: true,
      website: generatedWebsite,
      message: 'Website generated successfully'
    })

  } catch (error) {
    console.error('Error generating website:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}