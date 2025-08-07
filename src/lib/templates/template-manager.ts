import { db } from '@/lib/db'

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: string
  previewUrl?: string
  config: {
    primaryColor?: string
    secondaryColor?: string
    layout: string
    style: string
    sections: string[]
    features: string[]
  }
  isActive: boolean
}

export interface GeneratedTemplate {
  html: string
  css: string
  js: string
  assets: string[]
}

export class TemplateManager {
  
  async getAllTemplates(): Promise<TemplateConfig[]> {
    try {
      const templates = await db.template.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })

      return templates.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: template.category,
        previewUrl: template.previewUrl,
        config: JSON.parse(template.config),
        isActive: template.isActive
      }))
    } catch (error) {
      console.error('Error fetching templates:', error)
      return []
    }
  }

  async getTemplateById(id: string): Promise<TemplateConfig | null> {
    try {
      const template = await db.template.findUnique({
        where: { id, isActive: true }
      })

      if (!template) return null

      return {
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: template.category,
        previewUrl: template.previewUrl,
        config: JSON.parse(template.config),
        isActive: template.isActive
      }
    } catch (error) {
      console.error('Error fetching template:', error)
      return null
    }
  }

  async createTemplate(templateData: Omit<TemplateConfig, 'id'>): Promise<TemplateConfig> {
    try {
      const template = await db.template.create({
        data: {
          id: templateData.config.id || this.generateTemplateId(),
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          previewUrl: templateData.previewUrl,
          config: JSON.stringify(templateData.config),
          isActive: templateData.isActive
        }
      })

      return {
        id: template.id,
        name: template.name,
        description: template.description || '',
        category: template.category,
        previewUrl: template.previewUrl,
        config: JSON.parse(template.config),
        isActive: template.isActive
      }
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  async generateWebsite(
    templateId: string,
    websiteData: {
      business: any
      content: any
      designPreferences: any
    }
  ): Promise<GeneratedTemplate> {
    try {
      const template = await this.getTemplateById(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      // Generate HTML based on template
      const html = this.generateHTML(template, websiteData)
      
      // Generate CSS with custom colors
      const css = this.generateCSS(template, websiteData.designPreferences)
      
      // Generate JavaScript for interactivity
      const js = this.generateJavaScript(template)
      
      // List of required assets
      const assets = this.getRequiredAssets(template)

      return {
        html,
        css,
        js,
        assets
      }
    } catch (error) {
      console.error('Error generating website:', error)
      throw error
    }
  }

  private generateHTML(template: TemplateConfig, websiteData: any): string {
    const { business, content, designPreferences } = websiteData
    const homepageContent = JSON.parse(content.homepage || '{}')
    const contactContent = JSON.parse(content.contact || '{}')
    const servicesContent = JSON.parse(content.services || '{}')
    const productsContent = JSON.parse(content.products || '{}')

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${JSON.parse(content.seo || '{}').title || business.businessName}</title>
    <meta name="description" content="${JSON.parse(content.seo || '{}').description || business.description}">
    <meta name="keywords" content="${(JSON.parse(content.seo || '{}').keywords || []).join(', ')}">
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-800">${business.businessName}</h1>
                <nav class="hidden md:flex space-x-6">
                    <a href="#home" class="text-gray-600 hover:text-gray-800">Home</a>
                    <a href="#about" class="text-gray-600 hover:text-gray-800">About</a>
                    <a href="#services" class="text-gray-600 hover:text-gray-800">Services</a>
                    <a href="#products" class="text-gray-600 hover:text-gray-800">Products</a>
                    <a href="#contact" class="text-gray-600 hover:text-gray-800">Contact</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl md:text-6xl font-bold mb-4">${homepageContent.heroTitle || business.businessName}</h2>
            <p class="text-xl md:text-2xl mb-8">${homepageContent.heroSubtitle || business.description}</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                ${homepageContent.callToAction || 'Get Started'}
            </button>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-8">About Us</h2>
                <p class="text-lg text-gray-600">${content.about || business.description}</p>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16 bg-gray-100">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${(servicesContent.services || []).map((service: string, index: number) => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-3">${service}</h3>
                    <p class="text-gray-600">Professional ${service.toLowerCase()} services tailored to meet your specific needs.</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="py-16">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Our Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${(productsContent.products || []).map((product: string, index: number) => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <h3 class="text-xl font-semibold mb-3">${product}</h3>
                    <p class="text-gray-600">High-quality ${product.toLowerCase()} designed for optimal performance.</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-gray-100">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div class="max-w-2xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-xl font-semibold mb-4">Get in Touch</h3>
                        <div class="space-y-2">
                            <p><strong>Email:</strong> ${contactContent.email || business.email}</p>
                            <p><strong>Phone:</strong> ${contactContent.phone || business.phone}</p>
                            <p><strong>Address:</strong> ${contactContent.address || `${business.address}, ${business.city}, ${business.state} ${business.zipCode}`}</p>
                        </div>
                    </div>
                    <div>
                        <form class="space-y-4">
                            <input type="text" placeholder="Your Name" class="w-full px-4 py-2 border rounded-lg">
                            <input type="email" placeholder="Your Email" class="w-full px-4 py-2 border rounded-lg">
                            <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-2 border rounded-lg"></textarea>
                            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2024 ${business.businessName}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`
  }

  private generateCSS(template: TemplateConfig, designPreferences: any): string {
    return `/* Custom CSS Variables */
:root {
    --primary-color: ${designPreferences.primaryColor || '#3B82F6'};
    --secondary-color: ${designPreferences.secondaryColor || '#8B5CF6'};
    --text-primary: #1F2937;
    --text-secondary: #6B7280;
    --bg-primary: #FFFFFF;
    --bg-secondary: #F9FAFB;
}

/* Base Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

/* Header Styles */
header {
    background-color: var(--bg-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Button Styles */
button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
}

/* Section Styles */
section {
    padding: 4rem 0;
}

section:nth-child(even) {
    background-color: var(--bg-secondary);
}

/* Card Styles */
.bg-white {
    background-color: var(--bg-primary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bg-white:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    h1 {
        font-size: 1.5rem;
    }
    
    h2 {
        font-size: 1.25rem;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
}

/* Animation Classes */
.fade-in {
    animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.slide-in {
    animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}`
  }

  private generateJavaScript(template: TemplateConfig): string {
    return `// Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.className = 'md:hidden text-2xl';
    mobileMenuButton.style.cssText = 'position: absolute; top: 1rem; right: 1rem;';
    
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (window.innerWidth < 768 && nav) {
        nav.style.display = 'none';
        header.appendChild(mobileMenuButton);
        
        mobileMenuButton.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Form submission handler
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    });

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const header = document.querySelector('header');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.bg-white');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});`
  }

  private getRequiredAssets(template: TemplateConfig): string[] {
    return [
      'https://cdn.tailwindcss.com',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ]
  }

  private generateTemplateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Initialize default templates
  async initializeDefaultTemplates(): Promise<void> {
    const defaultTemplates = [
      {
        id: 'modern',
        name: 'Modern Business',
        description: 'Clean and professional design perfect for modern businesses',
        category: 'business',
        config: {
          layout: 'single-page',
          style: 'modern',
          sections: ['hero', 'about', 'services', 'contact'],
          features: ['responsive', 'seo-friendly', 'fast-loading']
        }
      },
      {
        id: 'creative',
        name: 'Creative Studio',
        description: 'Bold and artistic design for creative professionals',
        category: 'creative',
        config: {
          layout: 'portfolio',
          style: 'bold',
          sections: ['hero', 'portfolio', 'about', 'contact'],
          features: ['portfolio-gallery', 'animations', 'custom-fonts']
        }
      },
      {
        id: 'minimal',
        name: 'Minimal Portfolio',
        description: 'Simple and elegant design for minimalists',
        category: 'portfolio',
        config: {
          layout: 'single-page',
          style: 'minimal',
          sections: ['hero', 'work', 'about', 'contact'],
          features: ['clean-design', 'typography-focused', 'fast']
        }
      },
      {
        id: 'corporate',
        name: 'Corporate',
        description: 'Formal and structured design for corporate websites',
        category: 'business',
        config: {
          layout: 'multi-page',
          style: 'formal',
          sections: ['hero', 'about', 'services', 'team', 'contact'],
          features: ['professional', 'multi-language', 'accessibility']
        }
      }
    ]

    for (const templateData of defaultTemplates) {
      const existingTemplate = await db.template.findUnique({
        where: { id: templateData.id }
      })

      if (!existingTemplate) {
        await this.createTemplate({
          ...templateData,
          isActive: true
        })
      }
    }
  }
}

export const templateManager = new TemplateManager()