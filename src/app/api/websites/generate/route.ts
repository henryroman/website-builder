import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { contentGenerator } from '@/lib/ai/content-generator'

interface WebsiteBuilderData {
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
    const data: WebsiteBuilderData = await request.json()

    // Validate required fields
    if (!data.businessInfo || !data.designPreferences || !data.websiteContent) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Create or get user (for demo, we'll create a simple user)
    let user = await db.user.findUnique({
      where: { email: data.businessInfo.email }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          id: uuidv4(),
          email: data.businessInfo.email,
          name: data.businessInfo.businessName
        }
      })
    }

    // Create a default template if it doesn't exist
    let template = await db.template.findUnique({
      where: { id: data.designPreferences.template }
    })

    if (!template) {
      template = await db.template.create({
        data: {
          id: data.designPreferences.template,
          name: `${data.designPreferences.template.charAt(0).toUpperCase() + data.designPreferences.template.slice(1)} Template`,
          category: 'default',
          config: JSON.stringify({
            primaryColor: data.designPreferences.primaryColor,
            secondaryColor: data.designPreferences.secondaryColor,
            layout: data.designPreferences.layout,
            style: data.designPreferences.style
          })
        }
      })
    }

    // Generate unique subdomain
    const subdomain = `${data.businessInfo.businessName.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().slice(0, 8)}`

    // Generate enhanced content using AI
    let enhancedContent
    let seoContent
    
    try {
      enhancedContent = await contentGenerator.enhanceBusinessContent(
        data.businessInfo,
        data.websiteContent,
        data.designPreferences
      )
      
      seoContent = await contentGenerator.generateSeoContent(
        data.businessInfo,
        enhancedContent
      )
    } catch (aiError) {
      console.error('AI content generation failed, using fallback:', aiError)
      // Use basic content generation as fallback
      enhancedContent = {
        heroTitle: data.businessInfo.businessName,
        heroSubtitle: data.businessInfo.description,
        aboutContent: data.businessInfo.description,
        serviceDescriptions: data.websiteContent.services.split('\n').filter(s => s.trim()),
        productDescriptions: data.websiteContent.products.split('\n').filter(p => p.trim()),
        metaDescription: data.businessInfo.description,
        keywords: [data.businessInfo.industry],
        callToAction: 'Contact Us Today'
      }
      
      seoContent = {
        title: `${data.businessInfo.businessName} - ${data.businessInfo.industry}`,
        description: data.businessInfo.description,
        keywords: [data.businessInfo.industry],
        schema: {}
      }
    }

    // Create website with enhanced content
    const website = await db.website.create({
      data: {
        id: uuidv4(),
        name: data.businessInfo.businessName,
        subdomain,
        status: 'DRAFT',
        templateId: template.id,
        userId: user.id,
        business: {
          create: {
            id: uuidv4(),
            businessName: data.businessInfo.businessName,
            description: data.businessInfo.description,
            industry: data.businessInfo.industry,
            email: data.businessInfo.email,
            phone: data.businessInfo.phone,
            address: data.businessInfo.address,
            city: data.businessInfo.city,
            state: data.businessInfo.state,
            zipCode: data.businessInfo.zipCode,
            country: data.businessInfo.country,
            hours: JSON.stringify({
              operatingHours: data.websiteContent.hours
            }),
            services: JSON.stringify({
              services: enhancedContent.serviceDescriptions
            }),
            products: JSON.stringify({
              products: enhancedContent.productDescriptions
            })
          }
        },
        content: {
          create: {
            id: uuidv4(),
            homepage: JSON.stringify({
              heroTitle: enhancedContent.heroTitle,
              heroSubtitle: enhancedContent.heroSubtitle,
              features: data.websiteContent.features.split(',').map(f => f.trim()),
              callToAction: enhancedContent.callToAction
            }),
            about: enhancedContent.aboutContent,
            contact: JSON.stringify({
              email: data.businessInfo.email,
              phone: data.businessInfo.phone,
              address: `${data.businessInfo.address}, ${data.businessInfo.city}, ${data.businessInfo.state} ${data.businessInfo.zipCode}`
            }),
            services: JSON.stringify({
              services: enhancedContent.serviceDescriptions
            }),
            products: JSON.stringify({
              products: enhancedContent.productDescriptions
            }),
            seo: JSON.stringify({
              title: seoContent.title,
              description: seoContent.description,
              keywords: seoContent.keywords,
              schema: seoContent.schema
            }),
            customCss: `:root { --primary-color: ${data.designPreferences.primaryColor}; --secondary-color: ${data.designPreferences.secondaryColor}; }`
          }
        }
      }
    })

    // Create deployment record
    const deployment = await db.deployment.create({
      data: {
        id: uuidv4(),
        websiteId: website.id,
        userId: user.id,
        status: 'PENDING'
      }
    })

    // TODO: Trigger website generation process (this would be handled by a background job)
    // For now, we'll simulate the process
    try {
      // Simulate website generation
      await simulateWebsiteGeneration(website.id, deployment.id)
    } catch (error) {
      console.error('Website generation failed:', error)
      await db.deployment.update({
        where: { id: deployment.id },
        data: { status: 'FAILED', logs: JSON.stringify({ error: 'Generation failed' }) }
      })
    }

    return NextResponse.json({
      success: true,
      websiteId: website.id,
      deploymentId: deployment.id,
      message: 'Website generation started successfully'
    })

  } catch (error) {
    console.error('Error generating website:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulate website generation process
async function simulateWebsiteGeneration(websiteId: string, deploymentId: string) {
  // Update status to building
  await db.deployment.update({
    where: { id: deploymentId },
    data: { status: 'BUILDING' }
  })

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Update website status
  await db.website.update({
    where: { id: websiteId },
    data: { status: 'READY' }
  })

  // Update deployment status
  await db.deployment.update({
    where: { id: deploymentId },
    data: { 
      status: 'SUCCESS',
      url: `https://${(await db.website.findUnique({ where: { id: websiteId } }))?.subdomain}.example.com`,
      deployedAt: new Date()
    }
  })
}