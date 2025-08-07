'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Eye, 
  Edit, 
  Save, 
  RefreshCw, 
  Download, 
  Share,
  Palette,
  Type,
  Layout,
  Settings,
  Globe,
  Code,
  Loader2
} from 'lucide-react'

interface WebsiteData {
  id: string
  name: string
  subdomain: string
  status: string
  business: {
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
  content: {
    homepage: string
    about: string
    contact: string
    services: string
    products: string
    seo: string
    customCss: string
    customJs: string
  }
  template: {
    id: string
    name: string
    config: string
  }
}

export default function PreviewPage() {
  const params = useParams()
  const websiteId = params.id as string
  const [website, setWebsite] = useState<WebsiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState({})
  const [saving, setSaving] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    if (websiteId) {
      fetchWebsiteData()
    }
  }, [websiteId])

  const fetchWebsiteData = async () => {
    try {
      setLoading(true)
      // This would typically fetch from your API
      // For demo, we'll use mock data
      const mockWebsite: WebsiteData = {
        id: websiteId,
        name: 'Demo Website',
        subdomain: 'demo-website',
        status: 'READY',
        business: {
          businessName: 'Demo Business',
          description: 'A sample business for demonstration',
          industry: 'Technology',
          email: 'contact@demo.com',
          phone: '+1 (555) 123-4567',
          address: '123 Demo St',
          city: 'Demo City',
          state: 'DC',
          zipCode: '12345',
          country: 'USA'
        },
        content: {
          homepage: JSON.stringify({
            heroTitle: 'Welcome to Demo Business',
            heroSubtitle: 'Innovative solutions for modern businesses',
            features: ['Web Design', 'Development', 'Consulting']
          }),
          about: 'We are a leading technology company providing innovative solutions...',
          contact: JSON.stringify({
            email: 'contact@demo.com',
            phone: '+1 (555) 123-4567',
            address: '123 Demo St, Demo City, DC 12345'
          }),
          services: JSON.stringify(['Web Design', 'Development', 'Consulting']),
          products: JSON.stringify(['Product A', 'Product B', 'Product C']),
          seo: JSON.stringify({
            title: 'Demo Business - Technology Solutions',
            description: 'Innovative technology solutions for modern businesses',
            keywords: ['technology', 'web design', 'development']
          }),
          customCss: '',
          customJs: ''
        },
        template: {
          id: 'modern',
          name: 'Modern Business',
          config: JSON.stringify({
            primaryColor: '#3B82F6',
            secondaryColor: '#8B5CF6',
            layout: 'single-page',
            style: 'modern'
          })
        }
      }
      
      setWebsite(mockWebsite)
      setEditedContent(mockWebsite.content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load website data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (field: string, value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (website) {
        setWebsite({
          ...website,
          content: editedContent
        })
      }
      
      setIsEditing(false)
      toast({
        title: "Changes Saved",
        description: "Your website has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'desktop':
        return 'w-full max-w-6xl'
      case 'tablet':
        return 'w-full max-w-2xl'
      case 'mobile':
        return 'w-full max-w-sm'
      default:
        return 'w-full max-w-6xl'
    }
  }

  const generatePreviewHTML = () => {
    if (!website) return ''

    const homepageContent = JSON.parse(website.content.homepage || '{}')
    const contactContent = JSON.parse(website.content.contact || '{}')
    const servicesContent = JSON.parse(website.content.services || '[]')
    const productsContent = JSON.parse(website.content.products || '[]')
    const templateConfig = JSON.parse(website.template.config || '{}')

    return `
      <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm">
          <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold text-gray-800">${website.business.businessName}</h1>
              <nav class="hidden md:flex space-x-6">
                <a href="#home" class="text-gray-600 hover:text-gray-800">Home</a>
                <a href="#about" class="text-gray-600 hover:text-gray-800">About</a>
                <a href="#services" class="text-gray-600 hover:text-gray-800">Services</a>
                <a href="#contact" class="text-gray-600 hover:text-gray-800">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        <!-- Hero Section -->
        <section id="home" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl md:text-6xl font-bold mb-4">${homepageContent.heroTitle || website.business.businessName}</h2>
            <p class="text-xl md:text-2xl mb-8">${homepageContent.heroSubtitle || website.business.description}</p>
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-16">
          <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center">
              <h2 class="text-3xl font-bold mb-8">About Us</h2>
              <p class="text-lg text-gray-600">${website.content.about || website.business.description}</p>
            </div>
          </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-16 bg-gray-100">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${servicesContent.map((service: string) => `
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-xl font-semibold mb-3">${service}</h3>
                  <p class="text-gray-600">Professional ${service.toLowerCase()} services tailored to meet your needs.</p>
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
                    <p><strong>Email:</strong> ${contactContent.email || website.business.email}</p>
                    <p><strong>Phone:</strong> ${contactContent.phone || website.business.phone}</p>
                    <p><strong>Address:</strong> ${contactContent.address || `${website.business.address}, ${website.business.city}, ${website.business.state} ${website.business.zipCode}`}</p>
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
            <p>&copy; 2024 ${website.business.businessName}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    `
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Website not found</h2>
          <p className="text-gray-600">The requested website could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Website Preview</h1>
              <Badge variant={website.status === 'READY' ? 'default' : 'secondary'}>
                {website.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode('desktop')}>
                <Layout className="w-4 h-4 mr-2" />
                Desktop
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode('tablet')}>
                <Layout className="w-4 h-4 mr-2" />
                Tablet
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode('mobile')}>
                <Layout className="w-4 h-4 mr-2" />
                Mobile
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          {isEditing && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="style">Style</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="space-y-4">
                      <div>
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input
                          id="heroTitle"
                          value={JSON.parse(editedContent.homepage || '{}').heroTitle || ''}
                          onChange={(e) => {
                            const homepage = JSON.parse(editedContent.homepage || '{}')
                            homepage.heroTitle = e.target.value
                            handleContentChange('homepage', JSON.stringify(homepage))
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                        <Input
                          id="heroSubtitle"
                          value={JSON.parse(editedContent.homepage || '{}').heroSubtitle || ''}
                          onChange={(e) => {
                            const homepage = JSON.parse(editedContent.homepage || '{}')
                            homepage.heroSubtitle = e.target.value
                            handleContentChange('homepage', JSON.stringify(homepage))
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="about">About Content</Label>
                        <Textarea
                          id="about"
                          value={editedContent.about || ''}
                          onChange={(e) => handleContentChange('about', e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="services">Services (comma-separated)</Label>
                        <Input
                          id="services"
                          value={JSON.parse(editedContent.services || '[]').join(', ')}
                          onChange={(e) => handleContentChange('services', JSON.stringify(e.target.value.split(',').map(s => s.trim())))}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="style" className="space-y-4">
                      <div>
                        <Label htmlFor="customCss">Custom CSS</Label>
                        <Textarea
                          id="customCss"
                          value={editedContent.customCss || ''}
                          onChange={(e) => handleContentChange('customCss', e.target.value)}
                          rows={6}
                          placeholder="Enter custom CSS..."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customJs">Custom JavaScript</Label>
                        <Textarea
                          id="customJs"
                          value={editedContent.customJs || ''}
                          onChange={(e) => handleContentChange('customJs', e.target.value)}
                          rows={4}
                          placeholder="Enter custom JavaScript..."
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preview Area */}
          <div className={isEditing ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className={`${getPreviewSize()} bg-white border rounded-lg overflow-hidden shadow-lg`}>
                    <div 
                      className="preview-content"
                      dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}