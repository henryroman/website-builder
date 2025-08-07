import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Palette, Globe, Zap, Users, TrendingUp } from 'lucide-react'

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
            <span className="text-xl font-bold">Website Builder</span>
          </div>
          <nav className="flex space-x-4">
            <Link href="/website-builder" className="text-muted-foreground hover:text-foreground transition-colors">
              Build Website
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Build Your Professional Website
          <span className="text-primary"> in Minutes</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create stunning, responsive websites without any coding knowledge. 
          Our AI-powered builder helps you launch your online presence instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/website-builder">
            <Button size="lg" className="w-full sm:w-auto">
              Start Building - It's Free
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View Templates
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed Online</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                No technical skills required. Our intuitive interface guides you through every step.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Beautiful Templates</CardTitle>
              <CardDescription>
                Choose from dozens of professionally designed templates for every industry.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Mobile Responsive</CardTitle>
              <CardDescription>
                Your website will look perfect on all devices, from desktop to mobile.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built for speed and performance, ensuring the best user experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>AI-Powered</CardTitle>
              <CardDescription>
                Our AI helps generate content and optimize your website for success.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>SEO Optimized</CardTitle>
              <CardDescription>
                Built-in SEO tools help you rank higher in search engine results.
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
            <h3 className="text-xl font-semibold mb-2">Tell Us About Your Business</h3>
            <p className="text-muted-foreground">
              Fill out our simple form with your business information and preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Design</h3>
            <p className="text-muted-foreground">
              Select from beautiful templates and customize colors, fonts, and layout.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Launch Your Website</h3>
            <p className="text-muted-foreground">
              Your website is generated instantly and ready to share with the world.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Your Website?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of businesses who have already created their online presence.
        </p>
        <Link href="/website-builder">
          <Button size="lg">
            Get Started Now - It's Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Website Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}