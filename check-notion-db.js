import { Client } from '@notionhq/client'
import { config } from 'dotenv'

// Load environment variables
config()

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

async function checkNotionDatabase() {
  try {
    console.log('Checking Notion database properties...')
    
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_CUSTOMERS_DB_ID,
    })
    
    console.log('✅ Database found:', database.title[0]?.text?.content || 'Untitled Database')
    console.log('✅ Database properties:')
    
    Object.entries(database.properties).forEach(([key, property]) => {
      console.log(`  - ${key}: ${property.type}`)
    })
    
    return { success: true, properties: database.properties }
    
  } catch (error) {
    console.error('❌ Failed to check Notion database:', error)
    return { success: false, error: error.message }
  }
}

// Run the check
checkNotionDatabase().then(result => {
  console.log('Check result:', result)
  process.exit(result.success ? 0 : 1)
})