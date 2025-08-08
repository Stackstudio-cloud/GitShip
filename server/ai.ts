import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface CodeAnalysis {
  issues: Array<{
    type: 'performance' | 'security' | 'maintainability' | 'bug';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    suggestion: string;
    file?: string;
    line?: number;
  }>;
  optimizations: Array<{
    type: 'bundle-size' | 'performance' | 'seo' | 'accessibility';
    description: string;
    impact: 'low' | 'medium' | 'high';
    implementation: string;
  }>;
  score: number; // 0-100
}

export interface BuildOptimization {
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  environmentVariables: Record<string, string>;
  optimizations: string[];
}

export interface PerformanceInsight {
  metric: string;
  currentValue: number;
  targetValue: number;
  improvement: string;
  priority: 'low' | 'medium' | 'high';
}

export class GitShipAI {
  
  async analyzeCode(codeFiles: Array<{ path: string; content: string }>): Promise<CodeAnalysis> {
    try {
      const systemPrompt = `You are an expert code reviewer for web applications. 
Analyze the provided code files and identify issues, optimizations, and provide an overall quality score.
Focus on performance, security, maintainability, and potential bugs.
Respond with JSON in the specified format.`;

      const codeContent = codeFiles.map(file => 
        `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``
      ).join('\n\n');

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["performance", "security", "maintainability", "bug"] },
                    severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    message: { type: "string" },
                    suggestion: { type: "string" },
                    file: { type: "string" },
                    line: { type: "number" }
                  },
                  required: ["type", "severity", "message", "suggestion"]
                }
              },
              optimizations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", enum: ["bundle-size", "performance", "seo", "accessibility"] },
                    description: { type: "string" },
                    impact: { type: "string", enum: ["low", "medium", "high"] },
                    implementation: { type: "string" }
                  },
                  required: ["type", "description", "impact", "implementation"]
                }
              },
              score: { type: "number", minimum: 0, maximum: 100 }
            },
            required: ["issues", "optimizations", "score"]
          }
        },
        contents: `Analyze these code files:\n\n${codeContent}`
      });

      const analysis = JSON.parse(response.text || '{}');
      return analysis as CodeAnalysis;
    } catch (error) {
      console.error("Error analyzing code:", error);
      throw new Error(`Code analysis failed: ${error}`);
    }
  }

  async optimizeBuildConfiguration(packageJson: string, framework?: string): Promise<BuildOptimization> {
    try {
      const systemPrompt = `You are a build optimization expert. 
Based on the package.json and detected framework, provide optimal build configuration.
Focus on performance, bundle size, and deployment efficiency.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              framework: { type: "string" },
              buildCommand: { type: "string" },
              outputDirectory: { type: "string" },
              environmentVariables: { type: "object" },
              optimizations: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["framework", "buildCommand", "outputDirectory", "environmentVariables", "optimizations"]
          }
        },
        contents: `Optimize build configuration for:\nFramework: ${framework || 'auto-detect'}\npackage.json:\n${packageJson}`
      });

      return JSON.parse(response.text || '{}') as BuildOptimization;
    } catch (error) {
      console.error("Error optimizing build:", error);
      throw new Error(`Build optimization failed: ${error}`);
    }
  }

  async generatePerformanceInsights(
    metrics: Record<string, number>,
    framework: string
  ): Promise<PerformanceInsight[]> {
    try {
      const systemPrompt = `You are a web performance expert.
Analyze the provided performance metrics and generate actionable insights.
Focus on real-world improvements with specific implementation guidance.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metric: { type: "string" },
                currentValue: { type: "number" },
                targetValue: { type: "number" },
                improvement: { type: "string" },
                priority: { type: "string", enum: ["low", "medium", "high"] }
              },
              required: ["metric", "currentValue", "targetValue", "improvement", "priority"]
            }
          }
        },
        contents: `Analyze performance metrics for ${framework} application:\n${JSON.stringify(metrics, null, 2)}`
      });

      return JSON.parse(response.text || '[]') as PerformanceInsight[];
    } catch (error) {
      console.error("Error generating insights:", error);
      throw new Error(`Performance insights generation failed: ${error}`);
    }
  }

  async debugBuildError(errorLog: string, context: { framework: string; buildCommand: string }): Promise<{
    diagnosis: string;
    solutions: string[];
    preventions: string[];
  }> {
    try {
      const systemPrompt = `You are a build troubleshooting expert.
Analyze the build error and provide specific diagnosis and solutions.
Focus on actionable steps and prevention strategies.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              diagnosis: { type: "string" },
              solutions: {
                type: "array",
                items: { type: "string" }
              },
              preventions: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["diagnosis", "solutions", "preventions"]
          }
        },
        contents: `Debug build error:\nFramework: ${context.framework}\nBuild Command: ${context.buildCommand}\nError Log:\n${errorLog}`
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Error debugging build:", error);
      throw new Error(`Build debugging failed: ${error}`);
    }
  }

  async generateProjectDocumentation(
    codeFiles: Array<{ path: string; content: string }>,
    framework: string
  ): Promise<string> {
    try {
      const codeContent = codeFiles.slice(0, 10).map(file => 
        `File: ${file.path}\n\`\`\`\n${file.content.slice(0, 2000)}\n\`\`\``
      ).join('\n\n');

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate comprehensive README.md documentation for this ${framework} project:\n\n${codeContent}\n\nInclude: project description, setup instructions, deployment guide, and feature overview.`
      });

      return response.text || "Documentation generation failed";
    } catch (error) {
      console.error("Error generating documentation:", error);
      throw new Error(`Documentation generation failed: ${error}`);
    }
  }

  async suggestFrameworkMigration(
    currentFramework: string,
    targetFramework: string,
    codeFiles: Array<{ path: string; content: string }>
  ): Promise<{
    feasibility: 'easy' | 'moderate' | 'complex' | 'not-recommended';
    effort: string;
    benefits: string[];
    challenges: string[];
    migrationSteps: string[];
  }> {
    try {
      const systemPrompt = `You are a framework migration expert.
Analyze the migration from ${currentFramework} to ${targetFramework}.
Provide realistic assessment and step-by-step migration guidance.`;

      const codeContent = codeFiles.slice(0, 5).map(file => 
        `${file.path}: ${file.content.slice(0, 1000)}`
      ).join('\n\n');

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              feasibility: { type: "string", enum: ["easy", "moderate", "complex", "not-recommended"] },
              effort: { type: "string" },
              benefits: { type: "array", items: { type: "string" } },
              challenges: { type: "array", items: { type: "string" } },
              migrationSteps: { type: "array", items: { type: "string" } }
            },
            required: ["feasibility", "effort", "benefits", "challenges", "migrationSteps"]
          }
        },
        contents: `Analyze migration from ${currentFramework} to ${targetFramework}:\n\n${codeContent}`
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Error analyzing migration:", error);
      throw new Error(`Migration analysis failed: ${error}`);
    }
  }
}

export const gitshipAI = new GitShipAI();