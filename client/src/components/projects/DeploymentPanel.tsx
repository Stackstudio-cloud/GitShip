import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  GitBranch, 
  GitCommit, 
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';

interface Deployment {
  id: number;
  projectId: number;
  commitHash: string;
  commitMessage: string;
  branch: string;
  status: 'queued' | 'building' | 'success' | 'failed' | 'cancelled';
  buildLogs?: string;
  deployUrl?: string;
  previewUrl?: string;
  buildTime?: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

interface DeploymentPanelProps {
  projectId: number;
}

export default function DeploymentPanel({ projectId }: DeploymentPanelProps) {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const queryClient = useQueryClient();

  // Fetch deployments
  const { data: deployments = [], isLoading } = useQuery<Deployment[]>({
    queryKey: ['/api/projects', projectId, 'deployments'],
    refetchInterval: 5000, // Poll every 5 seconds for updates
  });

  // Deploy mutation
  const deployMutation = useMutation({
    mutationFn: async (data: { commitMessage?: string; branch?: string }) => {
      const response = await fetch(`/api/projects/${projectId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Deploy failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'deployments'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-600';
      case 'failed': return 'bg-red-600';
      case 'building': return 'bg-yellow-600';
      case 'queued': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'building': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'queued': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleDeploy = () => {
    deployMutation.mutate({
      commitMessage: 'Manual deployment',
    });
  };

  const formatBuildTime = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const latestDeployment = deployments[0];

  return (
    <div className="space-y-6">
      {/* Deploy Button & Latest Status */}
      <Card className="bg-dark-800 border-dark-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Deploy Project</CardTitle>
              <CardDescription className="text-gray-400">
                Deploy your latest changes instantly
              </CardDescription>
            </div>
            <Button
              onClick={handleDeploy}
              disabled={deployMutation.isPending}
              className="bg-neon-orange hover:bg-neon-orange/90 text-dark-900"
            >
              {deployMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Deploy Now
            </Button>
          </div>
        </CardHeader>
        
        {latestDeployment && (
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(latestDeployment.status)}`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">Latest Deployment</span>
                    <Badge variant="outline" className="text-xs">
                      {latestDeployment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <GitBranch className="w-3 h-3 mr-1" />
                      {latestDeployment.branch}
                    </span>
                    <span className="flex items-center">
                      <GitCommit className="w-3 h-3 mr-1" />
                      {latestDeployment.commitHash.slice(0, 7)}
                    </span>
                    {latestDeployment.buildTime && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatBuildTime(latestDeployment.buildTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {latestDeployment.deployUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(latestDeployment.deployUrl, '_blank')}
                  className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </Button>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Deployment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployments List */}
        <Card className="bg-dark-800 border-dark-600">
          <CardHeader>
            <CardTitle className="text-white">Deployment History</CardTitle>
            <CardDescription className="text-gray-400">
              Recent deployments and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
                </div>
              ) : deployments.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No deployments yet. Click "Deploy Now" to get started!
                </div>
              ) : (
                <div className="space-y-3">
                  {deployments.map((deployment: Deployment) => (
                    <div
                      key={deployment.id}
                      onClick={() => setSelectedDeployment(deployment)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedDeployment?.id === deployment.id
                          ? 'border-neon-cyan bg-dark-700'
                          : 'border-dark-600 hover:border-dark-500 bg-dark-750'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(deployment.status)}
                          <span className="text-white font-medium">
                            {deployment.commitMessage || 'No message'}
                          </span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            deployment.status === 'success' ? 'text-green-400 border-green-400' :
                            deployment.status === 'failed' ? 'text-red-400 border-red-400' :
                            deployment.status === 'building' ? 'text-yellow-400 border-yellow-400' :
                            'text-blue-400 border-blue-400'
                          }`}
                        >
                          {deployment.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center">
                          <GitBranch className="w-3 h-3 mr-1" />
                          {deployment.branch}
                        </span>
                        <span className="flex items-center">
                          <GitCommit className="w-3 h-3 mr-1" />
                          {deployment.commitHash.slice(0, 7)}
                        </span>
                        <span>
                          {formatDistanceToNow(new Date(deployment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Deployment Details */}
        <Card className="bg-dark-800 border-dark-600">
          <CardHeader>
            <CardTitle className="text-white">Build Details</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedDeployment ? `Deployment #${selectedDeployment.id}` : 'Select a deployment to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDeployment ? (
              <div className="space-y-4">
                {/* Deployment Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedDeployment.status)}
                      <span className="text-white capitalize">{selectedDeployment.status}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Build Time</span>
                    <div className="text-white mt-1">
                      {selectedDeployment.buildTime ? formatBuildTime(selectedDeployment.buildTime) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Branch</span>
                    <div className="text-white mt-1">{selectedDeployment.branch}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Commit</span>
                    <div className="text-white mt-1 font-mono">
                      {selectedDeployment.commitHash.slice(0, 12)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-dark-600" />

                {/* Action Buttons */}
                {selectedDeployment.deployUrl && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedDeployment.deployUrl, '_blank')}
                      className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Site
                    </Button>
                    {selectedDeployment.previewUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedDeployment.previewUrl, '_blank')}
                        className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-dark-900"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    )}
                  </div>
                )}

                <Separator className="bg-dark-600" />

                {/* Build Logs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Build Logs</span>
                    {selectedDeployment.buildLogs && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([selectedDeployment.buildLogs!], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `deployment-${selectedDeployment.id}-logs.txt`;
                          a.click();
                        }}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-48 w-full">
                    <pre className="text-xs text-gray-300 bg-dark-900 p-3 rounded font-mono whitespace-pre-wrap">
                      {selectedDeployment.buildLogs || 'No build logs available'}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Select a deployment from the history to view build details and logs
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}