import { templateManager } from '@/lib/templates/template-manager'

async function initializeTemplates() {
  try {
    console.log('Initializing default templates...')
    await templateManager.initializeDefaultTemplates()
    console.log('Default templates initialized successfully!')
  } catch (error) {
    console.error('Error initializing templates:', error)
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeTemplates()
}

export { initializeTemplates }