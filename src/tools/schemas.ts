import { z } from "zod";

console.error("Loading schemas.ts");

// Config tools schemas
export const GetConfigArgsSchema = z.object({});

export const SetConfigValueArgsSchema = z.object({
  key: z.string(),
  value: z.any(),
});

// Empty schemas
export const ListProcessesArgsSchema = z.object({});

// Terminal tools schemas
export const ExecuteCommandArgsSchema = z.object({
  command: z.string(),
  timeout_ms: z.number().optional(),
  shell: z.string().optional(),
});

export const ReadOutputArgsSchema = z.object({
  pid: z.number(),
});

export const ForceTerminateArgsSchema = z.object({
  pid: z.number(),
});

export const ListSessionsArgsSchema = z.object({});

export const KillProcessArgsSchema = z.object({
  pid: z.number(),
});

// Filesystem tools schemas
export const ReadFileArgsSchema = z.object({
  path: z.string(),
  isUrl: z.boolean().optional().default(false),
});

export const ReadMultipleFilesArgsSchema = z.object({
  paths: z.array(z.string()),
});

export const WriteFileArgsSchema = z.object({
  path: z.string(),
  content: z.string(),
});

export const CreateDirectoryArgsSchema = z.object({
  path: z.string(),
});

export const ListDirectoryArgsSchema = z.object({
  path: z.string(),
});

export const MoveFileArgsSchema = z.object({
  source: z.string(),
  destination: z.string(),
});

export const SearchFilesArgsSchema = z.object({
  path: z.string(),
  pattern: z.string(),
  timeoutMs: z.number().optional(),
});

export const GetFileInfoArgsSchema = z.object({
  path: z.string(),
});

// Search tools schema
export const SearchCodeArgsSchema = z.object({
  path: z.string(),
  pattern: z.string(),
  filePattern: z.string().optional(),
  ignoreCase: z.boolean().optional(),
  maxResults: z.number().optional(),
  includeHidden: z.boolean().optional(),
  contextLines: z.number().optional(),
  timeoutMs: z.number().optional(),
});

// Edit tools schema
export const EditBlockArgsSchema = z.object({
  file_path: z.string(),
  old_string: z.string(),
  new_string: z.string(),
  expected_replacements: z.number().optional().default(1),
});

// Task Manager schemas
export const RequestPlanningArgsSchema = z.object({
  originalRequest: z.string(),
  splitDetails: z.string().optional(),
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

export const GetNextTaskArgsSchema = z.object({
  requestId: z.string(),
});

export const MarkTaskDoneArgsSchema = z.object({
  requestId: z.string(),
  taskId: z.string(),
  completedDetails: z.string().optional(),
});

export const ApproveTaskCompletionArgsSchema = z.object({
  requestId: z.string(),
  taskId: z.string(),
});

export const ApproveRequestCompletionArgsSchema = z.object({
  requestId: z.string(),
});

export const OpenTaskDetailsArgsSchema = z.object({
  taskId: z.string(),
});

export const ListRequestsArgsSchema = z.object({});

export const AddTasksToRequestArgsSchema = z.object({
  requestId: z.string(),
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
});

export const UpdateTaskArgsSchema = z.object({
  requestId: z.string(),
  taskId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const DeleteTaskArgsSchema = z.object({
  requestId: z.string(),
  taskId: z.string(),
});

// Sequential Thinking schemas
export const ProcessThoughtArgsSchema = z.object({
  thought: z.string(),
  thought_number: z.number(),
  total_thoughts: z.number(),
  next_thought_needed: z.boolean(),
  stage: z.string(),
  tags: z.array(z.string()).optional(),
  axioms_used: z.array(z.string()).optional(),
  assumptions_challenged: z.array(z.string()).optional(),
});

export const GenerateSummaryArgsSchema = z.object({});

export const ClearHistoryArgsSchema = z.object({});

export const ExportSessionArgsSchema = z.object({
  file_path: z.string(),
});

export const ImportSessionArgsSchema = z.object({
  file_path: z.string(),
});