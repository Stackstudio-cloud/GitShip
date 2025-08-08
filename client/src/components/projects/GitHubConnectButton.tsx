import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Github, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  GitBranch,
  Star,
  GitFork
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  language?: string;
  updated_at: string;
}

interface GitHubConnectButtonProps {
  onRepositorySelect?: (repo: GitHubRepository) => void;
  selectedRepo?: string;
  variant?: 'button' | 'card';
}

export default function GitHubConnectButton({ 
  onRepositorySelect, 
  selectedRepo,
  variant = 'button' 
}: GitHubConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check current user and GitHub connection status
  const { data: user } = useQuery<{
    githubAccessToken?: string;
    githubUsername?: string;
  }>({
    queryKey: ['/api/auth/user'],
  });

  // Fetch GitHub repositories when connected
  const { data: repositories = [], isLoading: reposLoading } = useQuery<GitHubRepository[]>({
    queryKey: ['/api/github/repositories'],
    enabled: !!user?.githubAccessToken,
  });

  // GitHub OAuth URL mutation
  const getAuthUrlMutation = useMutation({
    mutationFn: async (): Promise<{ authUrl: string }> => {
      const response = await fetch('/api/auth/github');
      if (!response.ok) throw new Error('Failed to get auth URL');
      return response.json();
    },
    onSuccess: (data: { authUrl: string }) => {
      window.location.href = data.authUrl;
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to GitHub",
        variant: "destructive",
      });
      setIsConnecting(false);
    },
  });

  const handleConnect = () => {
    setIsConnecting(true);
    getAuthUrlMutation.mutate();
  };

  const isConnected = user?.githubAccessToken && user?.githubUsername;

  if (variant === 'card') {
    return (
      <Card className="bg-dark-800 border-dark-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6 text-white" />
              <div>
                <CardTitle className="text-white">GitHub Connection</CardTitle>
                <CardDescription className="text-gray-400">
                  {isConnected 
                    ? `Connected as @${user.githubUsername}` 
                    : 'Connect your GitHub account to deploy repositories'
                  }
                </CardDescription>
              </div>
            </div>
            {isConnected ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {!isConnected ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Github className="w-4 h-4 mr-2" />
              )}
              Connect GitHub Account
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Select Repository</span>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {repositories.length} repos available
                </Badge>
              </div>
              
              {reposLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
                </div>
              ) : repositories.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No repositories found. Make sure you have repositories in your GitHub account.
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {repositories.map((repo: GitHubRepository) => (
                    <div
                      key={repo.id}
                      onClick={() => onRepositorySelect?.(repo)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRepo === repo.full_name
                          ? 'border-neon-cyan bg-dark-700'
                          : 'border-dark-600 hover:border-dark-500 bg-dark-750'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{repo.name}</span>
                          {repo.private && (
                            <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                              Private
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(repo.html_url, '_blank');
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {repo.description && (
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {repo.language && (
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mr-1" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center">
                          <GitFork className="w-3 h-3 mr-1" />
                          {repo.forks_count}
                        </span>
                        <span className="flex items-center">
                          <GitBranch className="w-3 h-3 mr-1" />
                          {repo.default_branch}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Button variant
  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || isConnected}
      variant={isConnected ? "outline" : "default"}
      className={isConnected 
        ? "border-green-400 text-green-400 hover:bg-green-400 hover:text-dark-900" 
        : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
      }
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isConnected ? (
        <CheckCircle className="w-4 h-4 mr-2" />
      ) : (
        <Github className="w-4 h-4 mr-2" />
      )}
      {isConnected 
        ? `Connected as @${user?.githubUsername}` 
        : 'Connect GitHub'
      }
    </Button>
  );
}