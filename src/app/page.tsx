import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Palette, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <img
                src="/logo.svg"
                alt="Z.ai Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold">Business Information Form</span>
          </div>
          <nav className="flex space-x-4">
            <Link href="/website-builder" className="text-muted-foreground hover:text-foreground transition-colors">
              Submit Form
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Submit Your Business Information
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Fill out our simple form to submit your business details to our database and automation system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/website-builder">
            <Button size="lg" className="w-full sm:w-auto">
              Start Now - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Collect Information</CardTitle>
              <CardDescription>
                We collect your business information through a simple, easy-to-use form.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Database Storage</CardTitle>
              <CardDescription>
                Your information is securely stored in our Notion database for easy access.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Automation</CardTitle>
              <CardDescription>
                Your data is automatically sent to our N8N workflow for processing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Fill Out the Form</h3>
            <p className="text-muted-foreground">
              Complete our business information form with your details and preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Data Processing</h3>
            <p className="text-muted-foreground">
              Your information is saved to our database and sent to our automation system.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Confirmation</h3>
            <p className="text-muted-foreground">
              Receive confirmation that your information has been successfully submitted.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Submit your business information in just a few simple steps.
        </p>
        <Link href="/website-builder">
          <Button size="lg">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Business Information Form. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}