'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Rocket, 
  RefreshCw, 
  XCircle, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Play,
  Trash2,
  BarChart3,
  Activity,
  Calendar,
  Timer
} from 'lucide-react'

interface Deployment {
  id: string
  status: string
  url?: string
  deployedAt?: string
  createdAt: string
  logs: Array<{
    message: string
    timestamp: string
    status: string
  }>
  website: {
    id: string
    name: string
    subdomain: string
  }
  user: {
    id: string
    email: string
    name?: string
  }
}

interface DeploymentStats {
  total: number
  successful: number
  failed: number
  pending: number
  averageDuration: number
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [stats, setStats] = useState<DeploymentStats>({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    averageDuration: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    fetchDeployments()
    fetchStats()
  }, [])

  const fetchDeployments = async (websiteId?: string) => {
    try {
      setLoading(true)
      const url = websiteId 
        ? `/api/deployments?websiteId=${websiteId}`
        : '/api/deployments?userId=demo-user-id' // Demo user ID
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch deployments')
      }
      const data = await response.json()
      setDeployments(data.deployments || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load deployments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/deployments?userId=demo-user-id')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleDeploymentAction = async (deploymentId: string, action: 'cancel' | 'retry') => {
    try {
      const response = await fetch(`/api/deployments/${deploymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} deployment`)
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: result.message || `Deployment ${action}ed successfully`,
      })

      // Refresh deployments
      fetchDeployments(selectedWebsiteId)
      fetchStats()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} deployment. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
      case 'BUILDING':
      case 'DEPLOYING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4" />
      case 'FAILED':
        return <XCircle className="w-4 h-4" />
      case 'PENDING':
      case 'BUILDING':
      case 'DEPLOYING':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 10
      case 'BUILDING':
        return 40
      case 'DEPLOYING':
        return 80
      case 'SUCCESS':
        return 100
      case 'FAILED':
      case 'CANCELLED':
        return 0
      default:
        return 0
    }
  }

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const DeploymentCard = ({ deployment }: { deployment: Deployment }) => {
    const progress = getProgressValue(deployment.status)
    const canCancel = ['PENDING', 'BUILDING', 'DEPLOYING'].includes(deployment.status)
    const canRetry = deployment.status === 'FAILED'

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                {deployment.website.name}
              </CardTitle>
              <CardDescription>
                {deployment.website.subdomain} • {formatDate(deployment.createdAt)}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(deployment.status)}>
              {deployment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                {getStatusIcon(deployment.status)}
                Deployment Progress
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* URL */}
          {deployment.url && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="w-4 h-4" />
              <a 
                href={deployment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {deployment.url}
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {canCancel && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeploymentAction(deployment.id, 'cancel')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            {canRetry && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeploymentAction(deployment.id, 'retry')}
              >
                <Play className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
            <Button variant="outline" size="sm" className="ml-auto">
              <Activity className="w-4 h-4 mr-2" />
              View Logs
            </Button>
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
            <h1 className="text-2xl font-bold">Deployments</h1>
            <Button onClick={() => fetchDeployments(selectedWebsiteId)} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh
            </Button>
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
                    Total Deployments
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Successful
                  </p>
                  <p className="text-2xl font-bold">{stats.successful}</p>
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
                    Failed
                  </p>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Duration
                  </p>
                  <p className="text-2xl font-bold">{formatDuration(stats.averageDuration)}</p>
                </div>
                <Timer className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deployments List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Deployments</TabsTrigger>
            <TabsTrigger value="pending">In Progress</TabsTrigger>
            <TabsTrigger value="successful">Successful</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : deployments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Rocket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No deployments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and deploy your first website
                  </p>
                  <Button>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Website
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {deployments.map((deployment) => (
                  <DeploymentCard key={deployment.id} deployment={deployment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deployments
                .filter(d => ['PENDING', 'BUILDING', 'DEPLOYING'].includes(d.status))
                .map((deployment) => (
                  <DeploymentCard key={deployment.id} deployment={deployment} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="successful">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deployments
                .filter(d => d.status === 'SUCCESS')
                .map((deployment) => (
                  <DeploymentCard key={deployment.id} deployment={deployment} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="failed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deployments
                .filter(d => d.status === 'FAILED')
                .map((deployment) => (
                  <DeploymentCard key={deployment.id} deployment={deployment} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}