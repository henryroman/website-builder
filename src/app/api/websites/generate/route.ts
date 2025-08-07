import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

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

    // Save data to Notion database
    let notionResult = null
    if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
      try {
        notionResult = await saveToNotion(data)
      } catch (notionError) {
        console.error('Failed to save to Notion:', notionError)
      }
    }

    // Post data to N8N webhook
    let webhookResult = null
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        webhookResult = await postToN8NWebhook(data)
      } catch (webhookError) {
        console.error('Failed to post to N8N webhook:', webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      notionResult,
      webhookResult,
      message: 'Data processed successfully'
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Save data to Notion database
async function saveToNotion(data: WebsiteBuilderData) {
  const pageData = {
    parent: {
      database_id: process.env.NOTION_DATABASE_ID!,
    },
    properties: {
      BusinessName: {
        title: [
          {
            text: {
              content: data.businessInfo.businessName,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: data.businessInfo.description,
            },
          },
        ],
      },
      Industry: {
        select: {
          name: data.businessInfo.industry,
        },
      },
      Email: {
        email: data.businessInfo.email,
      },
      Phone: {
        phone_number: data.businessInfo.phone,
      },
      Address: {
        rich_text: [
          {
            text: {
              content: `${data.businessInfo.address}, ${data.businessInfo.city}, ${data.businessInfo.state} ${data.businessInfo.zipCode}, ${data.businessInfo.country}`,
            },
          },
        ],
      },
      PrimaryColor: {
        rich_text: [
          {
            text: {
              content: data.designPreferences.primaryColor,
            },
          },
        ],
      },
      SecondaryColor: {
        rich_text: [
          {
            text: {
              content: data.designPreferences.secondaryColor,
            },
          },
        ],
      },
      Template: {
        select: {
          name: data.designPreferences.template,
        },
      },
      Services: {
        rich_text: [
          {
            text: {
              content: data.websiteContent.services,
            },
          },
        ],
      },
      Products: {
        rich_text: [
          {
            text: {
              content: data.websiteContent.products,
            },
          },
        ],
      },
      Hours: {
        rich_text: [
          {
            text: {
              content: data.websiteContent.hours,
            },
          },
        ],
      },
      Features: {
        rich_text: [
          {
            text: {
              content: data.websiteContent.features,
            },
          },
        ],
      },
      CreatedAt: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  }

  const response = await notion.pages.create(pageData)
  return response
}

// Post data to N8N webhook
async function postToN8NWebhook(data: WebsiteBuilderData) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL!
  
  const payload = {
    businessInfo: data.businessInfo,
    designPreferences: data.designPreferences,
    websiteContent: data.websiteContent,
    timestamp: new Date().toISOString(),
    source: 'website-builder-form'
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}