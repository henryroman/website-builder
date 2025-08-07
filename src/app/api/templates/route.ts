import { NextRequest, NextResponse } from 'next/server'
import { templateManager } from '@/lib/templates/template-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let templates = await templateManager.getAllTemplates()

    if (category) {
      templates = templates.filter(template => template.category === category)
    }

    return NextResponse.json({
      success: true,
      templates
    })

  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'config']
    for (const field of requiredFields) {
      if (!templateData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const newTemplate = await templateManager.createTemplate(templateData)

    return NextResponse.json({
      success: true,
      template: newTemplate,
      message: 'Template created successfully'
    })

  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}