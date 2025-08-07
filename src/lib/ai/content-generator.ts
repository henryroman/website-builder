import ZAI from 'z-ai-web-dev-sdk'

interface BusinessInfo {
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

interface DesignPreferences {
  primaryColor: string
  secondaryColor: string
  template: string
  layout: string
  style: string
}

interface WebsiteContent {
  services: string
  products: string
  hours: string
  features: string
}

interface GeneratedContent {
  heroTitle: string
  heroSubtitle: string
  aboutContent: string
  serviceDescriptions: string[]
  productDescriptions: string[]
  metaDescription: string
  keywords: string[]
  callToAction: string
}

export class ContentGenerator {
  private zai: any

  constructor() {
    this.zai = null
  }

  async initialize() {
    try {
      this.zai = await ZAI.create()
      return true
    } catch (error) {
      console.error('Failed to initialize ZAI:', error)
      return false
    }
  }

  async enhanceBusinessContent(
    businessInfo: BusinessInfo,
    websiteContent: WebsiteContent,
    designPreferences: DesignPreferences
  ): Promise<GeneratedContent> {
    if (!this.zai) {
      await this.initialize()
    }

    if (!this.zai) {
      // Fallback to basic content generation
      return this.generateFallbackContent(businessInfo, websiteContent)
    }

    try {
      const prompt = `
        You are a professional website content writer. Based on the following business information, generate enhanced website content that is engaging, professional, and optimized for conversions.

        Business Information:
        - Name: ${businessInfo.businessName}
        - Industry: ${businessInfo.industry}
        - Description: ${businessInfo.description}
        - Location: ${businessInfo.city}, ${businessInfo.state}

        Current Content:
        - Services: ${websiteContent.services}
        - Products: ${websiteContent.products}
        - Features: ${websiteContent.features}
        - Hours: ${websiteContent.hours}

        Design Style: ${designPreferences.style}
        Template Type: ${designPreferences.template}

        Please generate the following content in JSON format:
        {
          "heroTitle": "A compelling headline for the homepage hero section",
          "heroSubtitle": "A supporting subtitle that explains the value proposition",
          "aboutContent": "A detailed about section that tells the business story",
          "serviceDescriptions": ["Enhanced description for each service"],
          "productDescriptions": ["Enhanced description for each product"],
          "metaDescription": "SEO-optimized meta description (under 160 characters)",
          "keywords": ["relevant", "seo", "keywords"],
          "callToAction": "A compelling call-to-action phrase"
        }

        Make the content:
        - Professional and engaging
        - Industry-appropriate
        - SEO-optimized
        - Conversion-focused
        - Aligned with the ${designPreferences.style} style
      `

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert website content writer specializing in creating compelling, SEO-optimized business content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const content = completion.choices[0]?.message?.content
      
      if (content) {
        try {
          const parsedContent = JSON.parse(content)
          return {
            heroTitle: parsedContent.heroTitle || businessInfo.businessName,
            heroSubtitle: parsedContent.heroSubtitle || businessInfo.description,
            aboutContent: parsedContent.aboutContent || businessInfo.description,
            serviceDescriptions: parsedContent.serviceDescriptions || [],
            productDescriptions: parsedContent.productDescriptions || [],
            metaDescription: parsedContent.metaDescription || businessInfo.description,
            keywords: parsedContent.keywords || [businessInfo.industry],
            callToAction: parsedContent.callToAction || 'Contact Us Today'
          }
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError)
          return this.generateFallbackContent(businessInfo, websiteContent)
        }
      }

      return this.generateFallbackContent(businessInfo, websiteContent)

    } catch (error) {
      console.error('AI content generation failed:', error)
      return this.generateFallbackContent(businessInfo, websiteContent)
    }
  }

  async generateSeoContent(businessInfo: BusinessInfo, content: GeneratedContent): Promise<{
    title: string
    description: string
    keywords: string[]
    schema: any
  }> {
    if (!this.zai) {
      await this.initialize()
    }

    if (!this.zai) {
      return {
        title: `${businessInfo.businessName} - ${businessInfo.industry}`,
        description: content.metaDescription,
        keywords: content.keywords,
        schema: this.generateBasicSchema(businessInfo)
      }
    }

    try {
      const prompt = `
        Generate SEO-optimized metadata and structured data for a business website.

        Business: ${businessInfo.businessName}
        Industry: ${businessInfo.industry}
        Location: ${businessInfo.city}, ${businessInfo.state}
        Description: ${businessInfo.description}

        Current Content:
        - Hero Title: ${content.heroTitle}
        - Hero Subtitle: ${content.heroSubtitle}
        - About: ${content.aboutContent}

        Generate:
        1. SEO Title (under 60 characters)
        2. Meta Description (under 160 characters)
        3. Target Keywords (5-10 relevant keywords)
        4. Local Business JSON-LD schema

        Return in JSON format:
        {
          "title": "SEO title",
          "description": "Meta description",
          "keywords": ["keyword1", "keyword2"],
          "schema": { /* JSON-LD schema object */ }
        }
      `

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in local business optimization and structured data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const seoContent = completion.choices[0]?.message?.content
      
      if (seoContent) {
        try {
          const parsedSeo = JSON.parse(seoContent)
          return {
            title: parsedSeo.title || `${businessInfo.businessName} - ${businessInfo.industry}`,
            description: parsedSeo.description || content.metaDescription,
            keywords: parsedSeo.keywords || content.keywords,
            schema: parsedSeo.schema || this.generateBasicSchema(businessInfo)
          }
        } catch (parseError) {
          console.error('Failed to parse SEO response:', parseError)
          return this.getFallbackSeo(businessInfo, content)
        }
      }

      return this.getFallbackSeo(businessInfo, content)

    } catch (error) {
      console.error('SEO generation failed:', error)
      return this.getFallbackSeo(businessInfo, content)
    }
  }

  private generateFallbackContent(businessInfo: BusinessInfo, websiteContent: WebsiteContent): GeneratedContent {
    const services = websiteContent.services.split('\n').filter(s => s.trim())
    const products = websiteContent.products.split('\n').filter(p => p.trim())

    return {
      heroTitle: `${businessInfo.businessName} - Professional ${businessInfo.industry} Services`,
      heroSubtitle: businessInfo.description,
      aboutContent: `Welcome to ${businessInfo.businessName}, your trusted ${businessInfo.industry} provider in ${businessInfo.city}, ${businessInfo.state}. We are committed to delivering exceptional ${businessInfo.industry.toLowerCase()} services with professionalism and expertise.`,
      serviceDescriptions: services.map(service => `Professional ${service} services tailored to meet your specific needs.`),
      productDescriptions: products.map(product => `High-quality ${product} designed for optimal performance and reliability.`),
      metaDescription: `${businessInfo.businessName} offers professional ${businessInfo.industry} services in ${businessInfo.city}, ${businessInfo.state}. ${businessInfo.description}`,
      keywords: [businessInfo.industry, businessInfo.businessName, businessInfo.city, businessInfo.state],
      callToAction: 'Get in touch with us today for a consultation!'
    }
  }

  private getFallbackSeo(businessInfo: BusinessInfo, content: GeneratedContent) {
    return {
      title: `${businessInfo.businessName} - ${businessInfo.industry}`,
      description: content.metaDescription,
      keywords: content.keywords,
      schema: this.generateBasicSchema(businessInfo)
    }
  }

  private generateBasicSchema(businessInfo: BusinessInfo): any {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": businessInfo.businessName,
      "description": businessInfo.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessInfo.address,
        "addressLocality": businessInfo.city,
        "addressRegion": businessInfo.state,
        "postalCode": businessInfo.zipCode,
        "addressCountry": businessInfo.country
      },
      "telephone": businessInfo.phone,
      "email": businessInfo.email
    }
  }
}

export const contentGenerator = new ContentGenerator()