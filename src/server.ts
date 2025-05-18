import {Server} from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ListPromptsRequestSchema,
    type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import {zodToJsonSchema} from "zod-to-json-schema";

// Shared constants for tool descriptions
const PATH_GUIDANCE = `IMPORTANT: Always use absolute paths (starting with '/' or drive letter like 'C:\\') for reliability. Relative paths may fail as they depend on the current working directory. Tilde paths (~/...) might not work in all contexts. Unless the user explicitly asks for relative paths, use absolute paths.`;

const CMD_PREFIX_DESCRIPTION = `This command can be referenced as "DC: ..." or "use Desktop Commander to ..." in your instructions.`;

import {
    ExecuteCommandArgsSchema,
    ReadOutputArgsSchema,
    ForceTerminateArgsSchema,
    ListSessionsArgsSchema,
    KillProcessArgsSchema,
    ReadFileArgsSchema,
    ReadMultipleFilesArgsSchema,
    WriteFileArgsSchema,
    CreateDirectoryArgsSchema,
    ListDirectoryArgsSchema,
    MoveFileArgsSchema,
    SearchFilesArgsSchema,
    GetFileInfoArgsSchema,
    SearchCodeArgsSchema,
    GetConfigArgsSchema,
    SetConfigValueArgsSchema,
    ListProcessesArgsSchema,
    EditBlockArgsSchema,
    // Task Manager schemas
    RequestPlanningArgsSchema,
    GetNextTaskArgsSchema,
    MarkTaskDoneArgsSchema,
    ApproveTaskCompletionArgsSchema,
    ApproveRequestCompletionArgsSchema,
    OpenTaskDetailsArgsSchema,
    ListRequestsArgsSchema,
    AddTasksToRequestArgsSchema,
    UpdateTaskArgsSchema,
    DeleteTaskArgsSchema,
    // Sequential Thinking schemas
    ProcessThoughtArgsSchema,
    GenerateSummaryArgsSchema,
    ClearHistoryArgsSchema,
    ExportSessionArgsSchema,
    ImportSessionArgsSchema,
} from './tools/schemas.js';
import {getConfig, setConfigValue} from './tools/config.js';

import {VERSION} from './version.js';
import {capture} from "./utils/capture.js";

console.error("Loading server.ts");

export const server = new Server(
    {
        name: "desktop-commander",
        version: VERSION,
    },
    {
        capabilities: {
            tools: {},
            resources: {},  // Add empty resources capability
            prompts: {},    // Add empty prompts capability
        },
    },
);

// Add handler for resources/list method
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    // Return an empty list of resources
    return {
        resources: [],
    };
});

// Add handler for prompts/list method
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    // Return an empty list of prompts
    return {
        prompts: [],
    };
});

console.error("Setting up request handlers...");

server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
        console.error("Generating tools list...");
        return {
            tools: [
                // Configuration tools
                {
                    name: "get_config",
                    description:
                        `Get the complete server configuration as JSON. Config includes fields for: blockedCommands (array of blocked shell commands), defaultShell (shell to use for commands), allowedDirectories (paths the server can access). ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(GetConfigArgsSchema),
                },
                {
                    name: "set_config_value",
                    description:
                        `Set a specific configuration value by key. WARNING: Should be used in a separate chat from file operations and command execution to prevent security issues. Config keys include: blockedCommands (array), defaultShell (string), allowedDirectories (array of paths). IMPORTANT: Setting allowedDirectories to an empty array ([]) allows full access to the entire file system, regardless of the operating system. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(SetConfigValueArgsSchema),
                },

                // Filesystem tools
                {
                    name: "read_file",
                    description:
                        `Read the complete contents of a file from the file system or a URL. Prefer this over 'execute_command' with cat/type for viewing files. When reading from the file system, only works within allowed directories. Can fetch content from URLs when isUrl parameter is set to true. Handles text files normally and image files are returned as viewable images. Recognized image types: PNG, JPEG, GIF, WebP. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ReadFileArgsSchema),
                },
                {
                    name: "read_multiple_files",
                    description:
                        `Read the contents of multiple files simultaneously. Each file's content is returned with its path as a reference. Handles text files normally and renders images as viewable content. Recognized image types: PNG, JPEG, GIF, WebP. Failed reads for individual files won't stop the entire operation. Only works within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ReadMultipleFilesArgsSchema),
                },
                {
                    name: "write_file",
                    description:
                        `Completely replace file contents. Best for large changes (>20% of file) or when edit_block fails. Use with caution as it will overwrite existing files. Only works within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(WriteFileArgsSchema),
                },
                {
                    name: "create_directory",
                    description:
                        `Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. Only works within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(CreateDirectoryArgsSchema),
                },
                {
                    name: "list_directory",
                    description:
                        `Get a detailed listing of all files and directories in a specified path. Use this instead of 'execute_command' with ls/dir commands. Results distinguish between files and directories with [FILE] and [DIR] prefixes. Only works within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ListDirectoryArgsSchema),
                },
                {
                    name: "move_file",
                    description:
                        `Move or rename files and directories. 
                        Can move files between directories and rename them in a single operation. 
                        Both source and destination must be within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(MoveFileArgsSchema),
                },
                {
                    name: "search_files",
                    description:
                        `Finds files by name using a case-insensitive substring matching. 
                        Use this instead of 'execute_command' with find/dir/ls for locating files.
                        Searches through all subdirectories from the starting path. 
                        Has a default timeout of 30 seconds which can be customized using the timeoutMs parameter. 
                        Only searches within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(SearchFilesArgsSchema),
                },
                {
                    name: "search_code",
                    description:
                        `Search for text/code patterns within file contents using ripgrep. 
                        Use this instead of 'execute_command' with grep/find for searching code content.
                        Fast and powerful search similar to VS Code search functionality. 
                        Supports regular expressions, file pattern filtering, and context lines. 
                        Has a default timeout of 30 seconds which can be customized. 
                        Only searches within allowed directories. 
                        ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(SearchCodeArgsSchema),
                },
                {
                    name: "get_file_info",
                    description:
                        `Retrieve detailed metadata about a file or directory including size, creation time, last modified time, 
                        permissions, and type. 
                        Only works within allowed directories. ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(GetFileInfoArgsSchema),
                },
                // Note: list_allowed_directories removed - use get_config to check allowedDirectories

                // Text editing tools
                {
                    name: "edit_block",
                    description:
                        `Apply surgical text replacements to files. 
                        BEST PRACTICE: Make multiple small, focused edits rather than one large edit. 
                        Each edit_block call should change only what needs to be changed - include just enough context to uniquely identify the text being modified. 
                        Takes file_path, old_string (text to replace), new_string (replacement text), and optional expected_replacements parameter. 
                        By default, replaces only ONE occurrence of the search text. 
                        To replace multiple occurrences, provide the expected_replacements parameter with the exact number of matches expected. 
                        UNIQUENESS REQUIREMENT: When expected_replacements=1 (default), include the minimal amount of context necessary (typically 1-3 lines) before and after the change point, with exact whitespace and indentation. 
                        When editing multiple sections, make separate edit_block calls for each distinct change rather than one large replacement. 
                        When a close but non-exact match is found, a character-level diff is shown in the format: common_prefix{-removed-}{+added+}common_suffix to help you identify what's different. 
                        ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(EditBlockArgsSchema),
                },

                // Task Manager tools
                {
                    name: "request_planning",
                    description:
                        `Register a new user request and plan its associated tasks. You must provide 'originalRequest' and 'tasks', and optionally 'splitDetails'. This initiates a new workflow for handling a user's request. After adding tasks, use 'get_next_task' to retrieve the first task. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(RequestPlanningArgsSchema),
                },
                {
                    name: "get_next_task",
                    description:
                        `Given a 'requestId', return the next pending task. If all tasks are completed, it will indicate that no more tasks are left and that you must wait for the request completion approval. A progress table showing the current status of all tasks will be displayed with each response. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(GetNextTaskArgsSchema),
                },
                {
                    name: "mark_task_done",
                    description:
                        `Mark a given task as done after you've completed it. Provide 'requestId' and 'taskId', and optionally 'completedDetails'. After marking a task as done, DO NOT proceed to 'get_next_task' again until the user has explicitly approved this completed task using 'approve_task_completion'. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(MarkTaskDoneArgsSchema),
                },
                {
                    name: "approve_task_completion",
                    description:
                        `Once the assistant has marked a task as done using 'mark_task_done', the user must call this tool to approve that the task is genuinely completed. Only after this approval can you proceed to 'get_next_task' to move on. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ApproveTaskCompletionArgsSchema),
                },
                {
                    name: "approve_request_completion",
                    description:
                        `After all tasks are done and approved, this tool finalizes the entire request. The user must call this to confirm that the request is fully completed. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ApproveRequestCompletionArgsSchema),
                },
                {
                    name: "open_task_details",
                    description:
                        `Get details of a specific task by 'taskId'. This is for inspecting task information at any point. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(OpenTaskDetailsArgsSchema),
                },
                {
                    name: "list_requests",
                    description:
                        `List all requests with their basic information and summary of tasks. This provides a quick overview of all requests in the system. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ListRequestsArgsSchema),
                },
                {
                    name: "add_tasks_to_request",
                    description:
                        `Add new tasks to an existing request. This allows extending a request with additional tasks. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(AddTasksToRequestArgsSchema),
                },
                {
                    name: "update_task",
                    description:
                        `Update an existing task's title and/or description. Only uncompleted tasks can be updated. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(UpdateTaskArgsSchema),
                },
                {
                    name: "delete_task",
                    description:
                        `Delete a specific task from a request. Only uncompleted tasks can be deleted. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(DeleteTaskArgsSchema),
                },

                // Sequential Thinking tools
                {
                    name: "process_thought",
                    description:
                        `Add a sequential thought with its metadata. Use this for step-by-step problem solving and analysis. Stages include: Problem Definition, Research, Analysis, Synthesis, Conclusion. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ProcessThoughtArgsSchema),
                },
                {
                    name: "generate_summary",
                    description:
                        `Generate a summary of the entire thinking process. Shows progression through stages, key themes, and overall coherence. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(GenerateSummaryArgsSchema),
                },
                {
                    name: "clear_history",
                    description:
                        `Clear the thought history. Use this to start a fresh thinking session. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ClearHistoryArgsSchema),
                },
                {
                    name: "export_session",
                    description:
                        `Export the current thinking session to a file. Useful for saving your analysis. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ExportSessionArgsSchema),
                },
                {
                    name: "import_session",
                    description:
                        `Import a thinking session from a file. Useful for continuing previous analysis. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ImportSessionArgsSchema),
                },
                
                // Terminal tools
                {
                    name: "execute_command",
                    description:
                        `Execute a terminal command with timeout. 
                        Command will continue running in background if it doesn't complete within timeout. 
                        NOTE: For file operations, prefer specialized tools like read_file, search_code, list_directory instead of cat, grep, or ls commands.
                        ${PATH_GUIDANCE} ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ExecuteCommandArgsSchema),
                },
                {
                    name: "read_output",
                    description: `Read new output from a running terminal session. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ReadOutputArgsSchema),
                },
                {
                    name: "force_terminate",
                    description: `Force terminate a running terminal session. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ForceTerminateArgsSchema),
                },
                {
                    name: "list_sessions",
                    description: `List all active terminal sessions. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ListSessionsArgsSchema),
                },
                {
                    name: "list_processes",
                    description: `List all running processes. Returns process information including PID, command name, CPU usage, and memory usage. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(ListProcessesArgsSchema),
                },
                {
                    name: "kill_process",
                    description: `Terminate a running process by PID. Use with caution as this will forcefully terminate the specified process. ${CMD_PREFIX_DESCRIPTION}`,
                    inputSchema: zodToJsonSchema(KillProcessArgsSchema),
                },
            ],
        };
    } catch (error) {
        console.error("Error in list_tools request handler:", error);
        throw error;
    }
});

import * as handlers from './handlers/index.js';
import {ServerResult} from './types.js';
import {TaskManagerHandlers} from './handlers/task-manager-handlers.js';
import {SequentialThinkingHandlers} from './handlers/sequential-thinking-handlers.js';

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<ServerResult> => {
    try {
        const {name, arguments: args} = request.params;
        capture('server_call_tool', {
            name
        });

        // Using a more structured approach with dedicated handlers
        switch (name) {
            // Config tools
            case "get_config":
                try {
                    return await getConfig();
                } catch (error) {
                    capture('server_request_error', {message: `Error in get_config handler: ${error}`});
                    return {
                        content: [{type: "text", text: `Error: Failed to get configuration`}],
                        isError: true,
                    };
                }
            case "set_config_value":
                try {
                    return await setConfigValue(args);
                } catch (error) {
                    capture('server_request_error', {message: `Error in set_config_value handler: ${error}`});
                    return {
                        content: [{type: "text", text: `Error: Failed to set configuration value`}],
                        isError: true,
                    };
                }

            // Terminal tools
            case "execute_command":
                return await handlers.handleExecuteCommand(args);

            case "read_output":
                return await handlers.handleReadOutput(args);

            case "force_terminate":
                return await handlers.handleForceTerminate(args);

            case "list_sessions":
                return await handlers.handleListSessions();

            // Process tools
            case "list_processes":
                return await handlers.handleListProcesses();

            case "kill_process":
                return await handlers.handleKillProcess(args);

            // Filesystem tools
            case "read_file":
                return await handlers.handleReadFile(args);

            case "read_multiple_files":
                return await handlers.handleReadMultipleFiles(args);

            case "write_file":
                return await handlers.handleWriteFile(args);

            case "create_directory":
                return await handlers.handleCreateDirectory(args);

            case "list_directory":
                return await handlers.handleListDirectory(args);

            case "move_file":
                return await handlers.handleMoveFile(args);

            case "search_files":
                return await handlers.handleSearchFiles(args);

            case "search_code":
                return await handlers.handleSearchCode(args);

            case "get_file_info":
                return await handlers.handleGetFileInfo(args);

            case "edit_block":
                return await handlers.handleEditBlock(args);

            // Task Manager tools
            case "request_planning":
                return await TaskManagerHandlers.handleRequestPlanning(args);

            case "get_next_task":
                return await TaskManagerHandlers.handleGetNextTask(args);

            case "mark_task_done":
                return await TaskManagerHandlers.handleMarkTaskDone(args);

            case "approve_task_completion":
                return await TaskManagerHandlers.handleApproveTaskCompletion(args);

            case "approve_request_completion":
                return await TaskManagerHandlers.handleApproveRequestCompletion(args);

            case "open_task_details":
                return await TaskManagerHandlers.handleOpenTaskDetails(args);

            case "list_requests":
                return await TaskManagerHandlers.handleListRequests();

            case "add_tasks_to_request":
                return await TaskManagerHandlers.handleAddTasksToRequest(args);

            case "update_task":
                return await TaskManagerHandlers.handleUpdateTask(args);

            case "delete_task":
                return await TaskManagerHandlers.handleDeleteTask(args);

            // Sequential Thinking tools
            case "process_thought":
                return await SequentialThinkingHandlers.handleProcessThought(args);

            case "generate_summary":
                return await SequentialThinkingHandlers.handleGenerateSummary();

            case "clear_history":
                return await SequentialThinkingHandlers.handleClearHistory();

            case "export_session":
                return await SequentialThinkingHandlers.handleExportSession(args);

            case "import_session":
                return await SequentialThinkingHandlers.handleImportSession(args);

            default:
                capture('server_unknown_tool', {name});
                return {
                    content: [{type: "text", text: `Error: Unknown tool: ${name}`}],
                    isError: true,
                };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        capture('server_request_error', {
            error: errorMessage
        });
        return {
            content: [{type: "text", text: `Error: ${errorMessage}`}],
            isError: true,
        };
    }
});