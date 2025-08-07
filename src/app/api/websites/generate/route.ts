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
    let notionError = null
    
    if (process.env.NOTION_TOKEN && process.env.NOTION_CUSTOMERS_DB_ID) {
      try {
        notionResult = await saveToNotion(data)
        console.log('✅ Notion save successful')
      } catch (notionError) {
        notionError = notionError.message
        console.error('Failed to save to Notion:', notionError)
      }
    } else {
      notionError = 'Notion credentials not configured'
      console.error('Notion credentials not found in environment')
    }

    // Post data to N8N webhook
    let webhookResult = null
    let webhookError = null
    
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        webhookResult = await postToN8NWebhook(data)
        console.log('✅ N8N webhook successful')
      } catch (webhookError) {
        webhookError = webhookError.message
        console.error('Failed to post to N8N webhook:', webhookError)
      }
    } else {
      webhookError = 'N8N webhook URL not configured'
      console.error('N8N webhook URL not found in environment')
    }

    return NextResponse.json({
      success: true,
      notionResult: notionResult ? 'Success' : null,
      notionError: notionError,
      webhookResult: webhookResult ? 'Success' : null,
      webhookError: webhookError,
      message: 'Data processed successfully'
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Save data to Notion database with flexible property mapping
async function saveToNotion(data: WebsiteBuilderData) {
  try {
    // First, get the database schema to understand available properties
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_CUSTOMERS_DB_ID!,
    })

    // Build properties dynamically based on what exists in the database
    const properties: any = {
      // Try to find a title property
      ...(database.properties.Name ? {
        Name: {
          title: [
            {
              text: {
                content: data.businessInfo.businessName,
              },
            },
          ],
        }
      } : {}),
      ...(database.properties.Title ? {
        Title: {
          title: [
            {
              text: {
                content: data.businessInfo.businessName,
              },
            },
          ],
        }
      } : {}),
      ...(database.properties['Business Name'] ? {
        'Business Name': {
          title: [
            {
              text: {
                content: data.businessInfo.businessName,
              },
            },
          ],
        }
      } : {}),
    }

    // Add other properties if they exist
    if (database.properties.Description) {
      properties.Description = {
        rich_text: [
          {
            text: {
              content: data.businessInfo.description,
            },
          },
        ],
      }
    }

    if (database.properties.Email) {
      properties.Email = {
        email: data.businessInfo.email,
      }
    }

    if (database.properties.Phone) {
      properties.Phone = {
        phone_number: data.businessInfo.phone,
      }
    }

    if (database.properties.Industry) {
      properties.Industry = {
        select: {
          name: data.businessInfo.industry,
        },
      }
    }

    // Add other fields as rich text if the properties exist
    const richTextFields = {
      'Address': `${data.businessInfo.address}, ${data.businessInfo.city}, ${data.businessInfo.state} ${data.businessInfo.zipCode}, ${data.businessInfo.country}`,
      'Primary Color': data.designPreferences.primaryColor,
      'Secondary Color': data.designPreferences.secondaryColor,
      'Template': data.designPreferences.template,
      'Services': data.websiteContent.services,
      'Products': data.websiteContent.products,
      'Hours': data.websiteContent.hours,
      'Features': data.websiteContent.features,
    }

    Object.entries(richTextFields).forEach(([fieldName, value]) => {
      if (database.properties[fieldName]) {
        properties[fieldName] = {
          rich_text: [
            {
              text: {
                content: value,
              },
            },
          ],
        }
      }
    })

    // Add created date if property exists
    if (database.properties['Created At'] || database.properties['Created']) {
      const createdFieldName = database.properties['Created At'] ? 'Created At' : 'Created'
      properties[createdFieldName] = {
        date: {
          start: new Date().toISOString(),
        },
      }
    }

    const pageData = {
      parent: {
        database_id: process.env.NOTION_CUSTOMERS_DB_ID!,
      },
      properties,
    }

    const response = await notion.pages.create(pageData)
    return response
  } catch (error) {
    console.error('Notion save error:', error)
    throw error
  }
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
    const errorText = await response.text()
    console.error('N8N webhook error response:', errorText)
    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
  }

  return await response.json()
}