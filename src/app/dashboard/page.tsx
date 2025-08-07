'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Building2, 
  Globe, 
  Settings, 
  Plus, 
  ExternalLink, 
  Eye, 
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

interface Website {
  id: string
  name: string
  subdomain: string
  status: string
  createdAt: string
  business: {
    businessName: string
    industry: string
  }
  deployments: Array<{
    id: string
    status: string
    url?: string
    deployedAt?: string
    logs?: string
  }>
}

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState('demo@example.com') // For demo purposes
  const { toast } = useToast()

  useEffect(() => {
    fetchWebsites()
  }, [selectedEmail])

  const fetchWebsites = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/websites/list?email=${selectedEmail}`)
      if (!response.ok) {
        throw new Error('Failed to fetch websites')
      }
      const data = await response.json()
      setWebsites(data.websites || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load websites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY':
      case 'SUCCESS':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
      case 'BUILDING':
      case 'DEPLOYING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READY':
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
      case 'BUILDING':
      case 'DEPLOYING':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'FAILED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDeploymentProgress = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 25
      case 'BUILDING':
        return 50
      case 'DEPLOYING':
        return 75
      case 'SUCCESS':
        return 100
      case 'FAILED':
        return 0
      default:
        return 0
    }
  }

  const WebsiteCard = ({ website }: { website: Website }) => {
    const latestDeployment = website.deployments[0]
    const progress = getDeploymentProgress(latestDeployment?.status || '')

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {website.name}
              </CardTitle>
              <CardDescription>
                {website.business.industry} • {formatDate(website.createdAt)}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(website.status)}>
              {website.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Deployment Status */}
            {latestDeployment && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    {getStatusIcon(latestDeployment.status)}
                    Deployment Status
                  </span>
                  <span className="text-muted-foreground">
                    {latestDeployment.status}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                {latestDeployment.url && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={latestDeployment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {latestDeployment.url}
                    </a>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Viewing as:</span>
                <select 
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="demo@example.com">demo@example.com</option>
                </select>
              </div>
            </div>
            <Link href="/website-builder">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Websites
                  </p>
                  <p className="text-2xl font-bold">{websites.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Published
                  </p>
                  <p className="text-2xl font-bold">
                    {websites.filter(w => w.status === 'READY').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold">
                    {websites.filter(w => ['PENDING', 'BUILDING', 'DEPLOYING'].includes(w.status)).length}
                  </p>
                </div>
                <Loader2 className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed
                  </p>
                  <p className="text-2xl font-bold">
                    {websites.filter(w => w.status === 'FAILED').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Websites List */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Websites</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            <Button variant="outline" onClick={fetchWebsites} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : websites.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first website to get started
                  </p>
                  <Link href="/website-builder">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Website
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website) => (
                  <WebsiteCard key={website.id} website={website} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="published">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites
                .filter(w => w.status === 'READY')
                .map((website) => (
                  <WebsiteCard key={website.id} website={website} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="draft">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites
                .filter(w => w.status === 'DRAFT')
                .map((website) => (
                  <WebsiteCard key={website.id} website={website} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="failed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites
                .filter(w => w.status === 'FAILED')
                .map((website) => (
                  <WebsiteCard key={website.id} website={website} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}