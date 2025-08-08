import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import BuildLogs from "@/components/build-logs";
import DeploymentCard from "@/components/deployment-card";
import DeploymentPanel from "@/components/projects/DeploymentPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Rocket, 
  Github, 
  Globe, 
  BarChart3, 
  Zap, 
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import type { Project, Deployment, Function, Analytics } from "@shared/schema";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeDeployment, setActiveDeployment] = useState<number | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId.toString()],
    enabled: !authLoading && isAuthenticated && projectId > 0,
  });

  const { data: deployments = [], isLoading: deploymentsLoading } = useQuery<Deployment[]>({
    queryKey: ["/api/projects", projectId.toString(), "deployments"],
    enabled: !authLoading && isAuthenticated && projectId > 0,
  });

  const { data: functions = [] } = useQuery<Function[]>({
    queryKey: ["/api/projects", projectId.toString(), "functions"],
    enabled: !authLoading && isAuthenticated && projectId > 0,
  });

  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["/api/projects", projectId.toString(), "analytics"],
    enabled: !authLoading && isAuthenticated && projectId > 0,
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !authLoading && isAuthenticated,
  });

  const deployMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/projects/${projectId}/deploy`, {
        commitMessage: "Manual deployment from dashboard",
        branch: project?.branch || "main"
      });
    },
    onSuccess: () => {
      toast({
        title: "Deployment Started",
        description: "Your project is being deployed. Check the build logs for progress.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId.toString(), "deployments"] });
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const latestDeployment = deployments[0];
  const currentAnalytics = analytics[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-neon-green text-dark-900';
      case 'building':
        return 'bg-orange-500 text-white animate-pulse';
      case 'failed':
        return 'bg-red-500 text-white';
      case 'queued':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-neon-green';
      case 'building':
        return 'bg-orange-500 animate-pulse';
      case 'failed':
        return 'bg-red-500';
      case 'queued':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (authLoading || projectLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
              <p className="text-gray-400">The project you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar projects={allProjects} activeProjectId={projectId} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Project Header */}
          <div className="p-6 border-b border-dark-600">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Github className="w-4 h-4 mr-2" />
                    {project.repositoryUrl.replace('https://github.com/', '')}
                  </span>
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <a 
                      href={project.customDomain ? `https://${project.customDomain}` : `https://${project.name}.gitship.app`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:underline"
                    >
                      {project.customDomain || `${project.name}.gitship.app`}
                    </a>
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan"
                  onClick={() => window.location.href = `/projects/${projectId}/settings`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  onClick={() => deployMutation.mutate()}
                  disabled={deployMutation.isPending}
                  className="bg-neon-green text-dark-900 font-semibold hover:bg-neon-green/90"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  {deployMutation.isPending ? 'Deploying...' : 'Deploy'}
                </Button>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-dark-800 border-neon-green/30 hover:border-neon-green/60 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Latest Deploy</CardTitle>
                  {latestDeployment && (
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(latestDeployment.status)}`}></div>
                  )}
                </CardHeader>
                <CardContent>
                  {latestDeployment ? (
                    <div className="space-y-2">
                      <p className={`text-2xl font-bold ${
                        latestDeployment.status === 'success' ? 'text-neon-green' :
                        latestDeployment.status === 'building' ? 'text-orange-500' :
                        latestDeployment.status === 'failed' ? 'text-red-500' :
                        'text-gray-400'
                      }`}>
                        {latestDeployment.status === 'success' ? 'Published' :
                         latestDeployment.status === 'building' ? 'Building' :
                         latestDeployment.status === 'failed' ? 'Failed' :
                         'Queued'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {latestDeployment.createdAt && 
                          new Date(latestDeployment.createdAt).toLocaleString()
                        }
                      </p>
                      <p className="text-sm font-mono text-gray-300">
                        #{latestDeployment.commitHash}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-400">No Deploys</p>
                      <p className="text-sm text-gray-400">Start your first deployment</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-dark-800 border-neon-cyan/30 hover:border-neon-cyan/60 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Performance</CardTitle>
                  <BarChart3 className="h-5 w-5 text-neon-cyan" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-neon-cyan">98</p>
                    <p className="text-sm text-gray-400">Lighthouse Score</p>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-cyan to-neon-green h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-800 border-neon-purple/30 hover:border-neon-purple/60 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Visitors</CardTitle>
                  <Users className="h-5 w-5 text-neon-purple" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-neon-purple">
                      {currentAnalytics?.uniqueVisitors || 0}
                    </p>
                    <p className="text-sm text-gray-400">This month</p>
                    <p className="text-xs text-green-400">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      +12% from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="deployments" className="space-y-6">
              <TabsList className="bg-dark-800 border border-dark-600">
                <TabsTrigger 
                  value="deployments" 
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900"
                >
                  Deployments
                </TabsTrigger>
                <TabsTrigger 
                  value="functions"
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900"
                >
                  Functions
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-900"
                  onClick={() => window.location.href = `/projects/${projectId}/analytics`}
                >
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deployments" className="space-y-6">
                <DeploymentPanel projectId={projectId} />
              </TabsContent>

              <TabsContent value="functions" className="space-y-6">
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Serverless Functions</CardTitle>
                    <CardDescription>Manage your API endpoints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {functions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No functions found</h3>
                        <p className="text-gray-400 text-center mb-4 max-w-sm mx-auto">
                          Add a `/api` or `/functions` directory to your repository to deploy serverless functions
                        </p>
                        <Button variant="outline" className="border-gray-600 text-gray-400 hover:border-neon-cyan hover:text-neon-cyan">
                          Learn More
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {functions.map((func) => (
                          <div key={func.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg border border-gray-600">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                              <div>
                                <p className="font-medium">{func.path}</p>
                                <p className="text-xs text-gray-400">
                                  {func.handler} • {func.avgResponseTime}ms avg
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-neon-cyan hover:bg-neon-cyan/10">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-dark-800 border-dark-600">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Traffic Overview</CardTitle>
                      <CardDescription>Site performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Page Views (24h)</span>
                          <span className="text-xl font-bold text-neon-cyan">
                            {currentAnalytics?.pageViews || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Unique Visitors</span>
                          <span className="text-xl font-bold text-neon-purple">
                            {currentAnalytics?.uniqueVisitors || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Avg Load Time</span>
                          <span className="text-xl font-bold text-neon-green">
                            {currentAnalytics?.avgLoadTime ? `${(currentAnalytics.avgLoadTime / 1000).toFixed(1)}s` : '0s'}
                          </span>
                        </div>
                        <div className="w-full bg-dark-600 rounded-full h-2">
                          <div className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400">Performance score increased by 8% this week</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-dark-800 border-dark-600">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Bandwidth Usage</CardTitle>
                      <CardDescription>Data transfer statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-neon-purple">
                            {currentAnalytics?.bandwidth ? `${(currentAnalytics.bandwidth / (1024 * 1024 * 1024)).toFixed(1)} GB` : '0 GB'}
                          </p>
                          <p className="text-sm text-gray-400">This month</p>
                        </div>
                        <div className="w-full bg-dark-600 rounded-full h-3">
                          <div className="bg-neon-purple h-3 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 text-center">35% of monthly limit used</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
