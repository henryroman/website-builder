import { NextRequest, NextResponse } from 'next/server'
import { contentGenerator } from '@/lib/ai/content-generator'

interface EnhancementRequest {
  businessInfo: {
    businessName: string
    description: string
    industry: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  designPreferences: {
    primaryColor: string
    secondaryColor: string
    template: string
    layout: string
    style: string
  }
  websiteContent: {
    services: string
    products: string
    hours: string
    features: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: EnhancementRequest = await request.json()

    // Validate required fields
    if (!data.businessInfo || !data.designPreferences || !data.websiteContent) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Generate enhanced content using AI
    const enhancedContent = await contentGenerator.enhanceBusinessContent(
      data.businessInfo,
      data.websiteContent,
      data.designPreferences
    )

    // Generate SEO content
    const seoContent = await contentGenerator.generateSeoContent(
      data.businessInfo,
      enhancedContent
    )

    return NextResponse.json({
      success: true,
      enhancedContent,
      seoContent,
      message: 'Content enhanced successfully'
    })

  } catch (error) {
    console.error('Error enhancing content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}