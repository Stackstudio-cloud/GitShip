import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Star,
  GitFork,
  ExternalLink,
  Zap,
  Globe,
  Smartphone,
  Code,
  Palette,
  ShoppingCart,
  BookOpen,
  Briefcase,
  User,
  Heart
} from "lucide-react";
import { useState } from "react";
import PublicNavbar from "@/components/public-navbar";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Templates", count: 18 },
    { id: "react", name: "React", count: 6 },
    { id: "next", name: "Next.js", count: 4 },
    { id: "vue", name: "Vue.js", count: 2 },
    { id: "static", name: "Static Sites", count: 3 },
    { id: "e-commerce", name: "E-commerce", count: 3 },
    { id: "svelte", name: "Svelte", count: 1 },
    { id: "remix", name: "Remix", count: 1 },
    { id: "angular", name: "Angular", count: 1 }
  ];

  const templates = [
    {
      id: 1,
      name: "Astro Portfolio",
      description: "Fast, modern portfolio built with Astro featuring perfect Lighthouse scores",
      category: "static",
      framework: "Astro",
      stars: 2847,
      forks: 456,
      image: "https://astro.build/assets/press/astro-logo-dark.svg",
      tags: ["Portfolio", "Astro", "Performance", "TypeScript"],
      demoUrl: "https://astro-portfolio-template.netlify.app/",
      repoUrl: "https://github.com/withastro/astro/tree/main/examples/portfolio",
      featured: true
    },
    {
      id: 2,
      name: "Next.js SaaS Starter",
      description: "Complete SaaS starter with auth, payments, and dashboard",
      category: "next",
      framework: "Next.js",
      stars: 1256,
      forks: 298,
      image: "https://nextjs.org/static/favicon/favicon-32x32.png",
      tags: ["SaaS", "Auth", "Stripe", "Tailwind"],
      demoUrl: "https://next-saas-starter.vercel.app/",
      repoUrl: "https://github.com/mickasmt/next-saas-stripe-starter",
      featured: true
    },
    {
      id: 3,
      name: "React E-commerce",
      description: "Modern e-commerce store with cart, checkout, and product management",
      category: "e-commerce",
      framework: "React",
      stars: 4123,
      forks: 892,
      image: "https://react.dev/favicon-32x32.png",
      tags: ["E-commerce", "Cart", "Checkout", "Redux"],
      demoUrl: "https://react-shopping-cart-67954.firebaseapp.com/",
      repoUrl: "https://github.com/jeffersonRibeiro/react-shopping-cart",
      featured: true
    },
    {
      id: 4,
      name: "Gatsby Blog Starter",
      description: "Lightning-fast blog with markdown, tags, and SEO optimization",
      category: "static",
      framework: "Gatsby",
      stars: 1634,
      forks: 456,
      image: "https://www.gatsbyjs.com/icons/icon-32x32.png",
      tags: ["Blog", "Markdown", "SEO", "GraphQL"],
      demoUrl: "https://gatsby-starter-blog-demo.netlify.app/",
      repoUrl: "https://github.com/gatsbyjs/gatsby-starter-blog"
    },
    {
      id: 5,
      name: "Vue Admin Dashboard",
      description: "Professional admin dashboard with charts, tables, and analytics",
      category: "vue",
      framework: "Vue.js",
      stars: 5743,
      forks: 1421,
      image: "https://vuejs.org/images/icons/favicon-32x32.png",
      tags: ["Dashboard", "Admin", "Charts", "Vue 3"],
      demoUrl: "https://vue-element-admin.herokuapp.com/",
      repoUrl: "https://github.com/PanJiaChen/vue-element-admin"
    },
    {
      id: 6,
      name: "React Agency Site",
      description: "Modern agency website with animations and project showcase",
      category: "react",
      framework: "React",
      stars: 1289,
      forks: 334,
      image: "https://react.dev/favicon-32x32.png",
      tags: ["Agency", "Animations", "Framer Motion", "Portfolio"],
      demoUrl: "https://agency-template-react.netlify.app/",
      repoUrl: "https://github.com/CleverProgrammers/react-agency-website"
    },
    {
      id: 7,
      name: "Next.js Blog CMS",
      description: "Blog with headless CMS integration and dynamic content management",
      category: "next",
      framework: "Next.js",
      stars: 2156,
      forks: 567,
      image: "https://nextjs.org/static/favicon/favicon-32x32.png",
      tags: ["Blog", "CMS", "Sanity", "Dynamic"],
      demoUrl: "https://nextjs-blog-cms.vercel.app/",
      repoUrl: "https://github.com/vercel/next.js/tree/canary/examples/cms-sanity"
    },
    {
      id: 8,
      name: "React Native Web",
      description: "Cross-platform app template running on web, iOS, and Android",
      category: "react",
      framework: "React Native",
      stars: 3456,
      forks: 789,
      image: "https://react.dev/favicon-32x32.png",
      tags: ["Cross-platform", "Mobile", "Web", "Expo"],
      demoUrl: "https://snack.expo.dev/@expo/react-native-web-example",
      repoUrl: "https://github.com/expo/expo/tree/main/templates/expo-template-default"
    },
    {
      id: 9,
      name: "Nuxt 3 Landing Page",
      description: "Modern landing page with server-side rendering and animations",
      category: "vue",
      framework: "Nuxt.js",
      stars: 987,
      forks: 234,
      image: "https://nuxt.com/icon.png",
      tags: ["Landing", "SSR", "Vue 3", "Nuxt 3"],
      demoUrl: "https://nuxt3-awesome-starter.vercel.app/",
      repoUrl: "https://github.com/viandwi24/nuxt3-awesome-starter"
    },
    {
      id: 10,
      name: "Svelte Kit Starter",
      description: "Fast and modern web app template with SvelteKit",
      category: "svelte",
      framework: "SvelteKit",
      stars: 1543,
      forks: 298,
      image: "https://svelte.dev/favicon.png",
      tags: ["SvelteKit", "Fast", "Modern", "TypeScript"],
      demoUrl: "https://sveltekit-starter.vercel.app/",
      repoUrl: "https://github.com/sveltejs/kit/tree/master/packages/create-svelte/templates/default"
    },
    {
      id: 11,
      name: "Next.js E-commerce",
      description: "Full-stack e-commerce with Next.js, Stripe, and Prisma",
      category: "e-commerce",
      framework: "Next.js",
      stars: 2890,
      forks: 645,
      image: "https://nextjs.org/static/favicon/favicon-32x32.png",
      tags: ["E-commerce", "Stripe", "Prisma", "Full-stack"],
      demoUrl: "https://nextjs-ecommerce-template.vercel.app/",
      repoUrl: "https://github.com/vercel/commerce"
    },
    {
      id: 12,
      name: "Vite React Starter",
      description: "Lightning-fast React development setup with Vite",
      category: "react",
      framework: "Vite + React",
      stars: 1876,
      forks: 412,
      image: "https://vitejs.dev/logo.svg",
      tags: ["Vite", "React", "Fast", "HMR"],
      demoUrl: "https://vite-react-typescript-starter.netlify.app/",
      repoUrl: "https://github.com/uchihamalolan/vite-react-ts"
    },
    {
      id: 13,
      name: "Docusaurus Docs",
      description: "Modern documentation site with search and versioning",
      category: "static",
      framework: "Docusaurus",
      stars: 2345,
      forks: 567,
      image: "https://docusaurus.io/img/docusaurus.svg",
      tags: ["Documentation", "Search", "Versioning", "MDX"],
      demoUrl: "https://docusaurus.io/",
      repoUrl: "https://github.com/facebook/docusaurus"
    },
    {
      id: 14,
      name: "Remix Blog Stack",
      description: "Full-stack blog with authentication and database integration",
      category: "remix",
      framework: "Remix",
      stars: 1234,
      forks: 289,
      image: "https://remix.run/img/og.1.jpg",
      tags: ["Blog", "Full-stack", "Auth", "Database"],
      demoUrl: "https://remix-blog-stack.fly.dev/",
      repoUrl: "https://github.com/remix-run/indie-stack"
    },
    {
      id: 15,
      name: "T3 Stack App",
      description: "Full-stack TypeScript app with Next.js, tRPC, and Prisma",
      category: "next",
      framework: "T3 Stack",
      stars: 3456,
      forks: 789,
      image: "https://create.t3.gg/images/t3-light.svg",
      tags: ["TypeScript", "tRPC", "Prisma", "Next.js"],
      demoUrl: "https://create-t3-app.vercel.app/",
      repoUrl: "https://github.com/t3-oss/create-t3-app"
    },
    {
      id: 16,
      name: "Chakra UI Dashboard",
      description: "Beautiful dashboard template with Chakra UI components",
      category: "react",
      framework: "React + Chakra",
      stars: 2156,
      forks: 534,
      image: "https://chakra-ui.com/favicon.png",
      tags: ["Dashboard", "Chakra UI", "Components", "Design"],
      demoUrl: "https://horizon-ui.com/horizon-ui-chakra/",
      repoUrl: "https://github.com/horizon-ui/horizon-ui-chakra"
    },
    {
      id: 17,
      name: "Shopify Hydrogen",
      description: "Modern e-commerce storefront built with Shopify Hydrogen",
      category: "e-commerce",
      framework: "Hydrogen",
      stars: 1678,
      forks: 345,
      image: "https://shopify.dev/assets/api/hydrogen/hydrogen-logo.svg",
      tags: ["Shopify", "Hydrogen", "E-commerce", "GraphQL"],
      demoUrl: "https://hydrogen.shop/",
      repoUrl: "https://github.com/Shopify/hydrogen/tree/main/templates/demo-store"
    },
    {
      id: 18,
      name: "Angular Material Dashboard",
      description: "Enterprise dashboard with Angular Material design system",
      category: "angular",
      framework: "Angular",
      stars: 1945,
      forks: 567,
      image: "https://angular.io/assets/images/favicons/favicon-32x32.png",
      tags: ["Angular", "Material", "Dashboard", "Enterprise"],
      demoUrl: "https://material.angular.io/",
      repoUrl: "https://github.com/angular/components"
    }
  ];

  const featuredTemplates = templates.filter(t => t.featured);
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFrameworkIcon = (framework: string) => {
    switch (framework.toLowerCase()) {
      case "react": case "react native": return <Code className="w-4 h-4" />;
      case "vue.js": case "nuxt.js": return <Palette className="w-4 h-4" />;
      case "next.js": case "t3 stack": return <Zap className="w-4 h-4" />;
      case "gatsby": case "docusaurus": return <BookOpen className="w-4 h-4" />;
      case "astro": case "static": return <Globe className="w-4 h-4" />;
      case "sveltekit": return <Smartphone className="w-4 h-4" />;
      case "remix": case "angular": return <Briefcase className="w-4 h-4" />;
      case "vite + react": case "hydrogen": return <Zap className="w-4 h-4" />;
      case "react + chakra": return <Code className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const handleDeployTemplate = (template: any) => {
    // Create deployment URL with template info
    const deployUrl = `/deploy?template=${encodeURIComponent(template.repoUrl)}&name=${encodeURIComponent(template.name)}&framework=${encodeURIComponent(template.framework)}`;
    window.open(deployUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <PublicNavbar />
      {/* Header */}
      <section className="py-20 px-6 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 data-onboarding="templates-title" className="text-5xl font-bold mb-6">
            <span className="flame-gradient-text">Templates</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Deploy faster with our collection of professionally designed templates. 
            One-click deployment for instant results.
          </p>
          
          {/* Search */}
          <div data-onboarding="template-search" className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-dark-700 border-dark-600 text-white placeholder-gray-400 focus:border-neon-orange"
            />
          </div>

          {/* Categories */}
          <div data-onboarding="template-categories" className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`${
                  selectedCategory === category.id 
                    ? "flame-gradient text-dark-900" 
                    : "border-gray-600 text-white hover:bg-dark-700"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      {selectedCategory === "all" && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              <span className="flame-gradient-text">Featured</span> Templates
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredTemplates.map((template, index) => (
                <Card 
                  key={template.id} 
                  data-onboarding={index === 0 ? "featured-template" : undefined}
                  className="bg-dark-800 border-dark-600 hover:border-neon-orange/50 transition-all group"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-48 bg-gradient-to-br from-neon-orange/20 to-neon-red/20 flex items-center justify-center">
                      <Globe className="w-16 h-16 text-neon-orange/60" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-neon-yellow text-dark-900 font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-white group-hover:text-neon-orange transition-colors">
                        {template.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        {getFrameworkIcon(template.framework)}
                        <span>{template.framework}</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{template.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="w-4 h-4" />
                          <span>{template.forks}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-dark-600 text-gray-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleDeployTemplate(template)}
                        className="flex-1 flame-gradient text-dark-900 font-semibold"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Deploy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-white hover:bg-dark-700"
                        onClick={() => window.open(template.demoUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Templates */}
      <section className="py-16 px-6 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            All <span className="flame-gradient-text">Templates</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-dark-700 border-dark-600 hover:border-neon-orange/50 transition-all group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Globe className="w-12 h-12 text-gray-600" />
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-white text-lg group-hover:text-neon-orange transition-colors">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      {getFrameworkIcon(template.framework)}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{template.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3" />
                        <span>{template.forks}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-dark-600 text-gray-300 text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="secondary" className="bg-dark-600 text-gray-300 text-xs px-2 py-0">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handleDeployTemplate(template)}
                    className="w-full flame-gradient text-dark-900 font-semibold text-sm"
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    Deploy Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Can't find what you're <span className="flame-gradient-text">looking for</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Request a custom template or contribute your own to our growing collection
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="flame-gradient text-dark-900 font-semibold">
              <Heart className="w-4 h-4 mr-2" />
              Request Template
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-dark-700">
              <Code className="w-4 h-4 mr-2" />
              Submit Template
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}