import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GitHubConnectButton from '@/components/projects/GitHubConnectButton';
import { 
  Github, 
  Rocket, 
  Settings, 
  CheckCircle, 
  ArrowRight,
  GitBranch,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  repositoryUrl: z.string().url('Must be a valid GitHub repository URL'),
  branch: z.string().min(1, 'Branch is required'),
  framework: z.string().optional(),
  buildCommand: z.string().min(1, 'Build command is required'),
  outputDirectory: z.string().min(1, 'Output directory is required'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

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

const frameworkDefaults = {
  'nextjs': { buildCommand: 'npm run build', outputDirectory: '.next' },
  'react': { buildCommand: 'npm run build', outputDirectory: 'build' },
  'vue': { buildCommand: 'npm run build', outputDirectory: 'dist' },
  'vite': { buildCommand: 'npm run build', outputDirectory: 'dist' },
  'angular': { buildCommand: 'npm run build', outputDirectory: 'dist' },
  'svelte': { buildCommand: 'npm run build', outputDirectory: 'build' },
  'astro': { buildCommand: 'npm run build', outputDirectory: 'dist' },
  'gatsby': { buildCommand: 'npm run build', outputDirectory: 'public' },
  'remix': { buildCommand: 'npm run build', outputDirectory: 'build' },
  'nuxt': { buildCommand: 'npm run build', outputDirectory: '.output/public' },
  'static': { buildCommand: 'echo "No build required"', outputDirectory: '.' },
};

export default function CreateProjectPage() {
  const [, setLocation] = useLocation();
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [step, setStep] = useState<'connect' | 'configure' | 'deploy'>('connect');
  const { toast } = useToast();

  const { data: user } = useQuery<{
    githubAccessToken?: string;
    githubUsername?: string;
  }>({
    queryKey: ['/api/auth/user'],
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      repositoryUrl: '',
      branch: 'main',
      framework: '',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Project Created!",
        description: "Your project has been created and the first deployment is starting.",
      });
      setLocation(`/projects/${data.project.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Project Creation Failed",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleRepositorySelect = (repo: GitHubRepository) => {
    setSelectedRepo(repo);
    
    // Auto-fill form with repository data
    form.setValue('name', repo.name);
    form.setValue('description', repo.description || '');
    form.setValue('repositoryUrl', repo.html_url);
    form.setValue('branch', repo.default_branch);
    
    // Auto-detect framework based on language
    const detectedFramework = detectFramework(repo.language);
    if (detectedFramework) {
      form.setValue('framework', detectedFramework);
      const defaults = frameworkDefaults[detectedFramework as keyof typeof frameworkDefaults];
      if (defaults) {
        form.setValue('buildCommand', defaults.buildCommand);
        form.setValue('outputDirectory', defaults.outputDirectory);
      }
    }
    
    setStep('configure');
  };

  const detectFramework = (language?: string): string => {
    if (!language) return 'static';
    
    const languageMap: Record<string, string> = {
      'JavaScript': 'react',
      'TypeScript': 'react',
      'Vue': 'vue',
      'Angular': 'angular',
      'Svelte': 'svelte',
      'HTML': 'static',
      'CSS': 'static',
    };
    
    return languageMap[language] || 'static';
  };

  const onSubmit = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.6
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const isConnected = user?.githubAccessToken && user?.githubUsername;

  if (!isConnected) {
    return (
      <motion.div 
        className="min-h-screen bg-dark-900 p-6"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="in"
          >
            <motion.h1 
              className="text-3xl font-bold text-white mb-2"
              variants={staggerItem}
            >
              Create New Project
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              variants={staggerItem}
            >
              Deploy your GitHub repository with GitShip
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center min-h-[400px]"
            variants={staggerItem}
            initial="initial"
            animate="in"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Card className="w-full max-w-md bg-dark-800 border-dark-600 hover:border-neon-cyan/50 transition-colors duration-300">
                <CardHeader className="text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Github className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-white">Connect GitHub Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect your GitHub account to access your repositories and start deploying
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GitHubConnectButton />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (step === 'connect') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="connect-step"
          className="min-h-screen bg-dark-900 p-6"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="mb-8"
              variants={staggerContainer}
              initial="initial"
              animate="in"
            >
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                variants={staggerItem}
              >
                Create New Project
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                variants={staggerItem}
              >
                Select a repository to deploy
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="in"
            >
              {/* Progress Steps */}
              <motion.div 
                className="lg:col-span-1"
                variants={staggerItem}
              >
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle className="text-white">Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-neon-cyan text-dark-900 flex items-center justify-center text-sm font-medium"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(34, 211, 238, 0.7)",
                            "0 0 0 10px rgba(34, 211, 238, 0)",
                            "0 0 0 0 rgba(34, 211, 238, 0)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        1
                      </motion.div>
                      <span className="text-white">Select Repository</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0.5 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-600 text-gray-400 flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <span className="text-gray-400">Configure Settings</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0.5 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-600 text-gray-400 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <span className="text-gray-400">Deploy Project</span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Repository Selection */}
              <motion.div 
                className="lg:col-span-2"
                variants={staggerItem}
              >
                <GitHubConnectButton 
                  variant="card" 
                  onRepositorySelect={handleRepositorySelect}
                  selectedRepo={selectedRepo?.full_name}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === 'configure') {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="configure-step"
          className="min-h-screen bg-dark-900 p-6"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="mb-8"
              variants={staggerContainer}
              initial="initial"
              animate="in"
            >
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                variants={staggerItem}
              >
                Configure Project
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                variants={staggerItem}
              >
                Set up build configuration and deployment settings
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="in"
            >
              {/* Progress Steps */}
              <motion.div 
                className="lg:col-span-1"
                variants={staggerItem}
              >
                <Card className="bg-dark-800 border-dark-600 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut"
                        }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </motion.div>
                      <span className="text-white">Select Repository</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-neon-cyan text-dark-900 flex items-center justify-center text-sm font-medium"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(34, 211, 238, 0.7)",
                            "0 0 0 10px rgba(34, 211, 238, 0)",
                            "0 0 0 0 rgba(34, 211, 238, 0)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        2
                      </motion.div>
                      <span className="text-white">Configure Settings</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0.5 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-600 text-gray-400 flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <span className="text-gray-400">Deploy Project</span>
                    </motion.div>
                  </CardContent>
                </Card>

                {/* Selected Repository */}
                {selectedRepo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.4 }}
                  >
                    <Card className="bg-dark-800 border-dark-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm">Selected Repository</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2 mb-2">
                          <Github className="w-4 h-4 text-white" />
                          <span className="text-white font-medium">{selectedRepo.name}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          {selectedRepo.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            <GitBranch className="w-3 h-3 mr-1" />
                            {selectedRepo.default_branch}
                          </Badge>
                          {selectedRepo.language && (
                            <Badge variant="outline" className="text-xs">
                              {selectedRepo.language}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {/* Configuration Form */}
              <motion.div 
                className="lg:col-span-2"
                variants={staggerItem}
              >
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white">Project Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your build settings and deployment options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Project Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-dark-700 border-dark-600 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Branch</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-dark-700 border-dark-600 text-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-dark-700 border-dark-600 text-white" rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="framework"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Framework</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              const defaults = frameworkDefaults[value as keyof typeof frameworkDefaults];
                              if (defaults) {
                                form.setValue('buildCommand', defaults.buildCommand);
                                form.setValue('outputDirectory', defaults.outputDirectory);
                              }
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                                  <SelectValue placeholder="Select framework" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-dark-700 border-dark-600">
                                <SelectItem value="nextjs">Next.js</SelectItem>
                                <SelectItem value="react">React</SelectItem>
                                <SelectItem value="vue">Vue.js</SelectItem>
                                <SelectItem value="vite">Vite</SelectItem>
                                <SelectItem value="angular">Angular</SelectItem>
                                <SelectItem value="svelte">SvelteKit</SelectItem>
                                <SelectItem value="astro">Astro</SelectItem>
                                <SelectItem value="gatsby">Gatsby</SelectItem>
                                <SelectItem value="remix">Remix</SelectItem>
                                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                <SelectItem value="static">Static Site</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="buildCommand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Build Command</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-dark-700 border-dark-600 text-white font-mono" />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Command to build your project
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="outputDirectory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Output Directory</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-dark-700 border-dark-600 text-white font-mono" />
                              </FormControl>
                              <FormDescription className="text-gray-400">
                                Directory containing build output
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="repositoryUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Repository URL</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-dark-700 border-dark-600 text-white" readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep('connect')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={createProjectMutation.isPending}
                          className="bg-neon-orange hover:bg-neon-orange/90 text-dark-900"
                        >
                          {createProjectMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Rocket className="w-4 h-4 mr-2" />
                          )}
                          Create & Deploy
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}