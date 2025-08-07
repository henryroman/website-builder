import { Client } from '@notionhq/client'
import { config } from 'dotenv'

// Load environment variables
config()

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

async function testNotionConnection() {
  try {
    console.log('Testing Notion connection...')
    
    // Test database access
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_CUSTOMERS_DB_ID,
    })
    
    console.log('✅ Database found:', database.title[0]?.text?.content || 'Untitled Database')
    console.log('✅ Database properties:', Object.keys(database.properties))
    
    // Test creating a page
    const testData = {
      businessInfo: {
        businessName: 'Test Business',
        description: 'This is a test business description',
        industry: 'Technology',
        email: 'test@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      designPreferences: {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        template: 'modern',
        layout: 'Single Page',
        style: 'Modern'
      },
      websiteContent: {
        services: 'Web Development\nMobile Apps\nConsulting',
        products: 'Software\nHardware\nSupport',
        hours: 'Monday-Friday: 9AM-6PM\nSaturday: 10AM-4PM\nSunday: Closed',
        features: 'Contact form, Photo gallery, Blog'
      }
    }
    
    const pageData = {
      parent: {
        database_id: process.env.NOTION_CUSTOMERS_DB_ID,
      },
      properties: {
        BusinessName: {
          title: [
            {
              text: {
                content: testData.businessInfo.businessName,
              },
            },
          ],
        },
        Description: {
          rich_text: [
            {
              text: {
                content: testData.businessInfo.description,
              },
            },
          ],
        },
        Industry: {
          select: {
            name: testData.businessInfo.industry,
          },
        },
        Email: {
          email: testData.businessInfo.email,
        },
        Phone: {
          phone_number: testData.businessInfo.phone,
        },
        Address: {
          rich_text: [
            {
              text: {
                content: `${testData.businessInfo.address}, ${testData.businessInfo.city}, ${testData.businessInfo.state} ${testData.businessInfo.zipCode}, ${testData.businessInfo.country}`,
              },
            },
          ],
        },
        PrimaryColor: {
          rich_text: [
            {
              text: {
                content: testData.designPreferences.primaryColor,
              },
            },
          ],
        },
        SecondaryColor: {
          rich_text: [
            {
              text: {
                content: testData.designPreferences.secondaryColor,
              },
            },
          ],
        },
        Template: {
          select: {
            name: testData.designPreferences.template,
          },
        },
        Services: {
          rich_text: [
            {
              text: {
                content: testData.websiteContent.services,
              },
            },
          ],
        },
        Products: {
          rich_text: [
            {
              text: {
                content: testData.websiteContent.products,
              },
            },
          ],
        },
        Hours: {
          rich_text: [
            {
              text: {
                content: testData.websiteContent.hours,
              },
            },
          ],
        },
        Features: {
          rich_text: [
            {
              text: {
                content: testData.websiteContent.features,
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
    console.log('✅ Test page created successfully:', response.id)
    
    return { success: true, databaseId: database.id, pageId: response.id }
    
  } catch (error) {
    console.error('❌ Notion test failed:', error)
    return { success: false, error: error.message }
  }
}

// Run the test
testNotionConnection().then(result => {
  console.log('Test result:', result)
  process.exit(result.success ? 0 : 1)
})