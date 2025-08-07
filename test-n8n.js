import { config } from 'dotenv'

// Load environment variables
config()

async function testN8NWebhook() {
  try {
    console.log('Testing N8N webhook...')
    
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
      },
      timestamp: new Date().toISOString(),
      source: 'website-builder-form'
    }
    
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_URL is not defined')
    }
    
    console.log('Webhook URL:', webhookUrl)
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ Webhook test successful:', result)
    
    return { success: true, result }
    
  } catch (error) {
    console.error('❌ N8N webhook test failed:', error)
    return { success: false, error: error.message }
  }
}

// Run the test
testN8NWebhook().then(result => {
  console.log('Test result:', result)
  process.exit(result.success ? 0 : 1)
})