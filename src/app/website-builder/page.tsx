'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Business, Building2, Globe, Palette, Settings, CheckCircle2 } from 'lucide-react'

const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  industry: z.string().min(1, 'Industry is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(1, 'Country is required'),
})

const designPreferencesSchema = z.object({
  primaryColor: z.string().min(1, 'Primary color is required'),
  secondaryColor: z.string().min(1, 'Secondary color is required'),
  template: z.string().min(1, 'Template is required'),
  layout: z.string().min(1, 'Layout is required'),
  style: z.string().min(1, 'Style is required'),
})

const websiteContentSchema = z.object({
  services: z.string().min(1, 'Services are required'),
  products: z.string().min(1, 'Products are required'),
  hours: z.string().min(1, 'Operating hours are required'),
  features: z.string().min(1, 'Features are required'),
})

type BusinessInfo = z.infer<typeof businessInfoSchema>
type DesignPreferences = z.infer<typeof designPreferencesSchema>
type WebsiteContent = z.infer<typeof websiteContentSchema>

interface WebsiteBuilderData {
  businessInfo: BusinessInfo
  designPreferences: DesignPreferences
  websiteContent: WebsiteContent
}

const industries = [
  'Restaurant', 'Retail', 'Healthcare', 'Professional Services', 'Technology',
  'Real Estate', 'Education', 'Fitness', 'Beauty', 'Automotive', 'Other'
]

const templates = [
  { id: 'modern', name: 'Modern Business', description: 'Clean and professional' },
  { id: 'creative', name: 'Creative Studio', description: 'Bold and artistic' },
  { id: 'minimal', name: 'Minimal Portfolio', description: 'Simple and elegant' },
  { id: 'corporate', name: 'Corporate', description: 'Formal and structured' }
]

const layouts = ['Single Page', 'Multi Page', 'Landing Page', 'Portfolio']
const styles = ['Classic', 'Modern', 'Bold', 'Elegant', 'Playful']

export default function WebsiteBuilder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<WebsiteBuilderData>({
    businessInfo: {} as BusinessInfo,
    designPreferences: {} as DesignPreferences,
    websiteContent: {} as WebsiteContent,
  })
  
  const { toast } = useToast()

  const businessForm = useForm<BusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
  })

  const designForm = useForm<DesignPreferences>({
    resolver: zodResolver(designPreferencesSchema),
  })

  const contentForm = useForm<WebsiteContent>({
    resolver: zodResolver(websiteContentSchema),
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = async () => {
    let isValid = false
    
    switch (currentStep) {
      case 1:
        isValid = await businessForm.trigger()
        if (isValid) {
          setFormData(prev => ({
            ...prev,
            businessInfo: businessForm.getValues()
          }))
        }
        break
      case 2:
        isValid = await designForm.trigger()
        if (isValid) {
          setFormData(prev => ({
            ...prev,
            designPreferences: designForm.getValues()
          }))
        }
        break
      case 3:
        isValid = await contentForm.trigger()
        if (isValid) {
          setFormData(prev => ({
            ...prev,
            websiteContent: contentForm.getValues()
          }))
        }
        break
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/websites/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate website')
      }

      const result = await response.json()
      
      toast({
        title: "Information Submitted Successfully",
        description: "Your business information has been saved to our database and sent for processing.",
      })

      // Reset forms
      businessForm.reset()
      designForm.reset()
      contentForm.reset()
      setCurrentStep(1)
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepIndicator = ({ step, title, icon }: { step: number; title: string; icon: React.ReactNode }) => (
    <div className={`flex items-center space-x-2 ${currentStep >= step ? 'text-primary' : 'text-muted-foreground'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
        currentStep >= step ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
      }`}>
        {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : icon}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Business Information Form</h1>
          <p className="text-muted-foreground">Submit your business details for website creation</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <StepIndicator step={1} title="Business Info" icon={<Building2 className="w-4 h-4" />} />
            <StepIndicator step={2} title="Design" icon={<Palette className="w-4 h-4" />} />
            <StepIndicator step={3} title="Content" icon={<Globe className="w-4 h-4" />} />
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Business Information'}
              {currentStep === 2 && 'Design Preferences'}
              {currentStep === 3 && 'Website Content'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your business'}
              {currentStep === 2 && 'Choose your design preferences'}
              {currentStep === 3 && 'Add your content details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      {...businessForm.register('businessName')}
                      placeholder="Your Business Name"
                    />
                    {businessForm.formState.errors.businessName && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select onValueChange={(value) => businessForm.setValue('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {businessForm.formState.errors.industry && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.industry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    {...businessForm.register('description')}
                    placeholder="Describe your business..."
                    rows={3}
                  />
                  {businessForm.formState.errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {businessForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...businessForm.register('email')}
                      placeholder="contact@business.com"
                    />
                    {businessForm.formState.errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      {...businessForm.register('phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                    {businessForm.formState.errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...businessForm.register('address')}
                    placeholder="123 Business Street"
                  />
                  {businessForm.formState.errors.address && (
                    <p className="text-sm text-red-500 mt-1">
                      {businessForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...businessForm.register('city')}
                      placeholder="City"
                    />
                    {businessForm.formState.errors.city && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...businessForm.register('state')}
                      placeholder="State"
                    />
                    {businessForm.formState.errors.state && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      {...businessForm.register('zipCode')}
                      placeholder="12345"
                    />
                    {businessForm.formState.errors.zipCode && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.zipCode.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      {...businessForm.register('country')}
                      placeholder="Country"
                    />
                    {businessForm.formState.errors.country && (
                      <p className="text-sm text-red-500 mt-1">
                        {businessForm.formState.errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Design Preferences */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Choose Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {templates.map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all ${
                          designForm.watch('template') === template.id 
                            ? 'ring-2 ring-primary' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => designForm.setValue('template', template.id)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {designForm.formState.errors.template && (
                    <p className="text-sm text-red-500 mt-1">
                      {designForm.formState.errors.template.message}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="layout">Layout Style *</Label>
                    <Select onValueChange={(value) => designForm.setValue('layout', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        {layouts.map((layout) => (
                          <SelectItem key={layout} value={layout}>
                            {layout}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {designForm.formState.errors.layout && (
                      <p className="text-sm text-red-500 mt-1">
                        {designForm.formState.errors.layout.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="style">Design Style *</Label>
                    <Select onValueChange={(value) => designForm.setValue('style', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {designForm.formState.errors.style && (
                      <p className="text-sm text-red-500 mt-1">
                        {designForm.formState.errors.style.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      {...designForm.register('primaryColor')}
                      className="h-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      {...designForm.register('secondaryColor')}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Website Content */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="services">Services *</Label>
                  <Textarea
                    id="services"
                    {...contentForm.register('services')}
                    placeholder="List your services (one per line)"
                    rows={4}
                  />
                  {contentForm.formState.errors.services && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.services.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="products">Products *</Label>
                  <Textarea
                    id="products"
                    {...contentForm.register('products')}
                    placeholder="List your products (one per line)"
                    rows={4}
                  />
                  {contentForm.formState.errors.products && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.products.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hours">Operating Hours *</Label>
                  <Textarea
                    id="hours"
                    {...contentForm.register('hours')}
                    placeholder="Monday-Friday: 9AM-6PM&#10;Saturday: 10AM-4PM&#10;Sunday: Closed"
                    rows={3}
                  />
                  {contentForm.formState.errors.hours && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.hours.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="features">Website Features *</Label>
                  <Textarea
                    id="features"
                    {...contentForm.register('features')}
                    placeholder="Contact form, Photo gallery, Blog, Online booking, etc."
                    rows={3}
                  />
                  {contentForm.formState.errors.features && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.features.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Information'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}