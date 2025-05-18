import { ServerResult } from '../types.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

// Enums and interfaces to match the Python implementation
enum ThoughtStage {
  PROBLEM_DEFINITION = "Problem Definition",
  RESEARCH = "Research",
  ANALYSIS = "Analysis",
  SYNTHESIS = "Synthesis",
  CONCLUSION = "Conclusion"
}

interface ThoughtData {
  thought: string;
  thought_number: number;
  total_thoughts: number;
  next_thought_needed: boolean;
  stage: ThoughtStage;
  tags: string[];
  axioms_used: string[];
  assumptions_challenged: string[];
  timestamp?: string;
}

interface StorageData {
  thoughts: ThoughtData[];
}

export class SequentialThinkingHandlers {
  private static storageDir = process.env.MCP_STORAGE_DIR || path.join(os.homedir(), '.mcp', 'sequential-thinking');
  private static storageFile = path.join(this.storageDir, 'thoughts.json');
  private static data: StorageData = { thoughts: [] };
  private static initialized = false;

  private static async initialize() {
    if (!this.initialized) {
      await this.ensureStorageDir();
      await this.loadThoughts();
      this.initialized = true;
    }
  }

  private static async ensureStorageDir() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  private static async loadThoughts() {
    try {
      const data = await fs.readFile(this.storageFile, 'utf-8');
      this.data = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
      this.data = { thoughts: [] };
    }
  }

  private static async saveThoughts() {
    await fs.writeFile(this.storageFile, JSON.stringify(this.data, null, 2));
  }

  private static stageFromString(stage: string): ThoughtStage {
    const stageMap: { [key: string]: ThoughtStage } = {
      "Problem Definition": ThoughtStage.PROBLEM_DEFINITION,
      "Research": ThoughtStage.RESEARCH,
      "Analysis": ThoughtStage.ANALYSIS,
      "Synthesis": ThoughtStage.SYNTHESIS,
      "Conclusion": ThoughtStage.CONCLUSION
    };
    return stageMap[stage] || ThoughtStage.ANALYSIS;
  }

  static async handleProcessThought(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const {
        thought,
        thought_number,
        total_thoughts,
        next_thought_needed,
        stage,
        tags = [],
        axioms_used = [],
        assumptions_challenged = []
      } = args;

      // Validate required fields
      if (!thought || thought_number === undefined || total_thoughts === undefined || 
          next_thought_needed === undefined || !stage) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "Missing required fields",
              status: "failed"
            }, null, 2)
          }],
          isError: true
        };
      }

      // Create thought data
      const thoughtData: ThoughtData = {
        thought,
        thought_number,
        total_thoughts,
        next_thought_needed,
        stage: this.stageFromString(stage),
        tags,
        axioms_used,
        assumptions_challenged,
        timestamp: new Date().toISOString()
      };

      // Add to storage
      this.data.thoughts.push(thoughtData);
      await this.saveThoughts();

      // Generate analysis
      const analysis = this.analyzeThought(thoughtData, this.data.thoughts);

      return {
        content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: "failed"
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  static async handleGenerateSummary(): Promise<ServerResult> {
    try {
      await this.initialize();

      const summary = this.generateSummary(this.data.thoughts);

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: "failed"
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  static async handleClearHistory(): Promise<ServerResult> {
    try {
      await this.initialize();

      this.data.thoughts = [];
      await this.saveThoughts();

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "success",
            message: "Thought history cleared"
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: "failed"
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  static async handleExportSession(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { file_path } = args;
      
      if (!file_path) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "Missing file_path",
              status: "failed"
            }, null, 2)
          }],
          isError: true
        };
      }

      await fs.writeFile(file_path, JSON.stringify(this.data, null, 2));

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "success",
            message: `Session exported to ${file_path}`
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: "failed"
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  static async handleImportSession(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { file_path } = args;
      
      if (!file_path) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: "Missing file_path",
              status: "failed"
            }, null, 2)
          }],
          isError: true
        };
      }

      const data = await fs.readFile(file_path, 'utf-8');
      this.data = JSON.parse(data);
      await this.saveThoughts();

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "success",
            message: `Session imported from ${file_path}`
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: "failed"
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  // Analysis methods
  private static analyzeThought(thought: ThoughtData, allThoughts: ThoughtData[]): any {
    const stageProgress = this.getStageProgress(allThoughts);
    const themeAnalysis = this.analyzeThemes(allThoughts);
    const coherenceScore = this.calculateCoherence(thought, allThoughts);
    const progressMetrics = this.calculateProgress(allThoughts);

    return {
      thought_id: thought.thought_number,
      stage: thought.stage,
      coherence_score: coherenceScore,
      stage_progress: stageProgress,
      theme_analysis: themeAnalysis,
      progress_metrics: progressMetrics,
      next_suggestions: this.generateNextSuggestions(thought, allThoughts),
      status: "analyzed"
    };
  }

  private static generateSummary(thoughts: ThoughtData[]): any {
    if (thoughts.length === 0) {
      return {
        status: "no_thoughts",
        message: "No thoughts to summarize"
      };
    }

    const stages = Object.values(ThoughtStage);
    const stageBreakdown: { [key: string]: number } = {};
    stages.forEach(stage => {
      stageBreakdown[stage] = thoughts.filter(t => t.stage === stage).length;
    });

    const allTags = thoughts.flatMap(t => t.tags);
    const tagFrequency: { [key: string]: number } = {};
    allTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    const allAxioms = thoughts.flatMap(t => t.axioms_used);
    const axiomFrequency: { [key: string]: number } = {};
    allAxioms.forEach(axiom => {
      axiomFrequency[axiom] = (axiomFrequency[axiom] || 0) + 1;
    });

    const allAssumptions = thoughts.flatMap(t => t.assumptions_challenged);

    return {
      total_thoughts: thoughts.length,
      stage_breakdown: stageBreakdown,
      thought_progression: thoughts.map(t => ({
        number: t.thought_number,
        stage: t.stage,
        summary: t.thought.substring(0, 100) + (t.thought.length > 100 ? "..." : "")
      })),
      key_themes: Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ theme: tag, occurrences: count })),
      axioms_referenced: Object.entries(axiomFrequency)
        .sort((a, b) => b[1] - a[1])
        .map(([axiom, count]) => ({ axiom, count })),
      assumptions_challenged: [...new Set(allAssumptions)],
      completion_status: this.getCompletionStatus(thoughts),
      overall_coherence: this.calculateOverallCoherence(thoughts)
    };
  }

  private static getStageProgress(thoughts: ThoughtData[]): any {
    const stages = Object.values(ThoughtStage);
    const progress: { [key: string]: number } = {};
    
    stages.forEach(stage => {
      const stageThoughts = thoughts.filter(t => t.stage === stage);
      progress[stage] = stageThoughts.length;
    });

    return progress;
  }

  private static analyzeThemes(thoughts: ThoughtData[]): any {
    const themes: { [key: string]: number } = {};
    
    thoughts.forEach(thought => {
      thought.tags.forEach(tag => {
        themes[tag] = (themes[tag] || 0) + 1;
      });
    });

    return {
      dominant_themes: Object.entries(themes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([theme, count]) => theme),
      theme_frequency: themes
    };
  }

  private static calculateCoherence(thought: ThoughtData, allThoughts: ThoughtData[]): number {
    // Simple coherence calculation based on tag overlap
    if (allThoughts.length <= 1) return 1.0;

    const previousThoughts = allThoughts.slice(0, -1);
    const currentTags = new Set(thought.tags);
    
    let overlapScore = 0;
    previousThoughts.forEach(prevThought => {
      const prevTags = new Set(prevThought.tags);
      const overlap = [...currentTags].filter(tag => prevTags.has(tag)).length;
      overlapScore += overlap / Math.max(currentTags.size, prevTags.size);
    });

    return Math.min(overlapScore / previousThoughts.length, 1.0);
  }

  private static calculateProgress(thoughts: ThoughtData[]): any {
    const totalExpected = thoughts.length > 0 ? thoughts[0].total_thoughts : 0;
    const completed = thoughts.length;
    const percentage = totalExpected > 0 ? (completed / totalExpected) * 100 : 0;

    return {
      thoughts_completed: completed,
      total_expected: totalExpected,
      percentage_complete: Math.round(percentage),
      remaining: Math.max(0, totalExpected - completed)
    };
  }

  private static generateNextSuggestions(thought: ThoughtData, allThoughts: ThoughtData[]): string[] {
    const suggestions: string[] = [];
    
    if (thought.stage === ThoughtStage.PROBLEM_DEFINITION) {
      suggestions.push("Consider moving to Research phase to gather relevant information");
    } else if (thought.stage === ThoughtStage.RESEARCH) {
      suggestions.push("Analyze the gathered information in the Analysis phase");
    } else if (thought.stage === ThoughtStage.ANALYSIS) {
      suggestions.push("Synthesize findings to form coherent conclusions");
    }

    if (thought.assumptions_challenged.length === 0) {
      suggestions.push("Consider challenging underlying assumptions");
    }

    if (thought.axioms_used.length === 0) {
      suggestions.push("Reference relevant axioms or principles");
    }

    return suggestions;
  }

  private static getCompletionStatus(thoughts: ThoughtData[]): string {
    if (thoughts.length === 0) return "not_started";
    
    const lastThought = thoughts[thoughts.length - 1];
    if (!lastThought.next_thought_needed) return "completed";
    
    const percentage = this.calculateProgress(thoughts).percentage_complete;
    if (percentage < 30) return "early_stage";
    if (percentage < 70) return "mid_stage";
    return "late_stage";
  }

  private static calculateOverallCoherence(thoughts: ThoughtData[]): number {
    if (thoughts.length === 0) return 0;
    
    let totalCoherence = 0;
    thoughts.forEach((thought, index) => {
      if (index > 0) {
        totalCoherence += this.calculateCoherence(thought, thoughts.slice(0, index + 1));
      }
    });

    return thoughts.length > 1 ? totalCoherence / (thoughts.length - 1) : 1.0;
  }
}