import { ServerResult } from '../types.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

const DEFAULT_PATH = path.join(os.homedir(), "Documents", "tasks.json");
const TASK_FILE_PATH = process.env.TASK_MANAGER_FILE_PATH || DEFAULT_PATH;

interface Task {
  id: string;
  title: string;
  description: string;
  done: boolean;
  approved: boolean;
  completedDetails: string;
}

interface RequestEntry {
  requestId: string;
  originalRequest: string;
  splitDetails: string;
  tasks: Task[];
  completed: boolean;
}

interface TaskManagerFile {
  requests: RequestEntry[];
}

export class TaskManagerHandlers {
  private static requestCounter = 0;
  private static taskCounter = 0;
  private static data: TaskManagerFile = { requests: [] };
  private static initialized = false;

  private static async initialize() {
    if (!this.initialized) {
      await this.loadTasks();
      this.initialized = true;
    }
  }

  private static async loadTasks() {
    try {
      const data = await fs.readFile(TASK_FILE_PATH, "utf-8");
      this.data = JSON.parse(data);
      const allTaskIds: number[] = [];
      const allRequestIds: number[] = [];

      for (const req of this.data.requests) {
        const reqNum = Number.parseInt(req.requestId.replace("req-", ""), 10);
        if (!Number.isNaN(reqNum)) {
          allRequestIds.push(reqNum);
        }
        for (const t of req.tasks) {
          const tNum = Number.parseInt(t.id.replace("task-", ""), 10);
          if (!Number.isNaN(tNum)) {
            allTaskIds.push(tNum);
          }
        }
      }

      this.requestCounter = allRequestIds.length > 0 ? Math.max(...allRequestIds) : 0;
      this.taskCounter = allTaskIds.length > 0 ? Math.max(...allTaskIds) : 0;
    } catch (error) {
      this.data = { requests: [] };
    }
  }

  private static async saveTasks() {
    try {
      await fs.writeFile(TASK_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      throw error;
    }
  }

  private static formatTaskProgressTable(requestId: string): string {
    const req = this.data.requests.find((r) => r.requestId === requestId);
    if (!req) return "Request not found";

    let table = "\nProgress Status:\n";
    table += "| Task ID | Title | Description | Status | Approval |\n";
    table += "|----------|----------|------|------|----------|\n";

    for (const task of req.tasks) {
      const status = task.done ? "✅ Done" : "🔄 In Progress";
      const approved = task.approved ? "✅ Approved" : "⏳ Pending";
      table += `| ${task.id} | ${task.title} | ${task.description} | ${status} | ${approved} |\n`;
    }

    return table;
  }

  private static formatRequestsList(): string {
    let output = "\nRequests List:\n";
    output += "| Request ID | Original Request | Total Tasks | Completed | Approved |\n";
    output += "|------------|------------------|-------------|-----------|----------|\n";

    for (const req of this.data.requests) {
      const totalTasks = req.tasks.length;
      const completedTasks = req.tasks.filter((t) => t.done).length;
      const approvedTasks = req.tasks.filter((t) => t.approved).length;
      output += `| ${req.requestId} | ${req.originalRequest.substring(0, 30)}${req.originalRequest.length > 30 ? "..." : ""} | ${totalTasks} | ${completedTasks} | ${approvedTasks} |\n`;
    }

    return output;
  }

  static async handleRequestPlanning(args: any): Promise<ServerResult> {
    try {
      await this.initialize();
      
      const { originalRequest, tasks, splitDetails } = args;
      
      this.requestCounter += 1;
      const requestId = `req-${this.requestCounter}`;

      const newTasks: Task[] = [];
      for (const taskDef of tasks) {
        this.taskCounter += 1;
        newTasks.push({
          id: `task-${this.taskCounter}`,
          title: taskDef.title,
          description: taskDef.description,
          done: false,
          approved: false,
          completedDetails: "",
        });
      }

      this.data.requests.push({
        requestId,
        originalRequest,
        splitDetails: splitDetails || originalRequest,
        tasks: newTasks,
        completed: false,
      });

      await this.saveTasks();

      const progressTable = this.formatTaskProgressTable(requestId);

      const result = {
        status: "planned",
        requestId,
        totalTasks: newTasks.length,
        tasks: newTasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
        })),
        message: `Tasks have been successfully added. Please use 'get_next_task' to retrieve the first task.\n${progressTable}`,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleGetNextTask(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      if (req.completed) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "already_completed", message: "Request already completed." }, null, 2) }],
        };
      }

      const nextTask = req.tasks.find((t) => !t.done);
      if (!nextTask) {
        const allDone = req.tasks.every((t) => t.done);
        if (allDone && !req.completed) {
          const progressTable = this.formatTaskProgressTable(requestId);
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({
                status: "all_tasks_done",
                message: `All tasks have been completed. Awaiting request completion approval.\n${progressTable}`,
              }, null, 2) 
            }],
          };
        }
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "no_next_task", message: "No undone tasks found." }, null, 2) }],
        };
      }

      const progressTable = this.formatTaskProgressTable(requestId);
      const result = {
        status: "next_task",
        task: {
          id: nextTask.id,
          title: nextTask.title,
          description: nextTask.description,
        },
        message: `Next task is ready. Task approval will be required after completion.\n${progressTable}`,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleMarkTaskDone(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId, taskId, completedDetails } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      const task = req.tasks.find((t) => t.id === taskId);
      if (!task) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Task not found" }, null, 2) }],
        };
      }

      if (task.done) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "already_done", message: "Task is already marked done." }, null, 2) }],
        };
      }

      task.done = true;
      task.completedDetails = completedDetails || "";
      await this.saveTasks();

      const result = {
        status: "task_marked_done",
        requestId: req.requestId,
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          completedDetails: task.completedDetails,
          approved: task.approved,
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleApproveTaskCompletion(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId, taskId } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      const task = req.tasks.find((t) => t.id === taskId);
      if (!task) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Task not found" }, null, 2) }],
        };
      }

      if (!task.done) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Task not done yet." }, null, 2) }],
        };
      }

      if (task.approved) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "already_approved", message: "Task already approved." }, null, 2) }],
        };
      }

      task.approved = true;
      await this.saveTasks();

      const result = {
        status: "task_approved",
        requestId: req.requestId,
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          completedDetails: task.completedDetails,
          approved: task.approved,
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleApproveRequestCompletion(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      const allDone = req.tasks.every((t) => t.done);
      if (!allDone) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Not all tasks are done." }, null, 2) }],
        };
      }

      const allApproved = req.tasks.every((t) => t.done && t.approved);
      if (!allApproved) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Not all done tasks are approved." }, null, 2) }],
        };
      }

      req.completed = true;
      await this.saveTasks();

      const result = {
        status: "request_approved_complete",
        requestId: req.requestId,
        message: "Request is fully completed and approved.",
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleListRequests(): Promise<ServerResult> {
    try {
      await this.initialize();

      const requestsList = this.formatRequestsList();
      const result = {
        status: "requests_listed",
        message: `Current requests in the system:\n${requestsList}`,
        requests: this.data.requests.map((req) => ({
          requestId: req.requestId,
          originalRequest: req.originalRequest,
          totalTasks: req.tasks.length,
          completedTasks: req.tasks.filter((t) => t.done).length,
          approvedTasks: req.tasks.filter((t) => t.approved).length,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleOpenTaskDetails(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { taskId } = args;
      
      for (const req of this.data.requests) {
        const target = req.tasks.find((t) => t.id === taskId);
        if (target) {
          const result = {
            status: "task_details",
            requestId: req.requestId,
            originalRequest: req.originalRequest,
            splitDetails: req.splitDetails,
            completed: req.completed,
            task: {
              id: target.id,
              title: target.title,
              description: target.description,
              done: target.done,
              approved: target.approved,
              completedDetails: target.completedDetails,
            },
          };

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        }
      }

      return {
        content: [{ type: "text", text: JSON.stringify({ status: "task_not_found", message: "No such task found" }, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleAddTasksToRequest(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId, tasks } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      if (req.completed) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Cannot add tasks to completed request" }, null, 2) }],
        };
      }

      const newTasks: Task[] = [];
      for (const taskDef of tasks) {
        this.taskCounter += 1;
        newTasks.push({
          id: `task-${this.taskCounter}`,
          title: taskDef.title,
          description: taskDef.description,
          done: false,
          approved: false,
          completedDetails: "",
        });
      }

      req.tasks.push(...newTasks);
      await this.saveTasks();

      const progressTable = this.formatTaskProgressTable(requestId);
      const result = {
        status: "tasks_added",
        message: `Added ${newTasks.length} new tasks to request.\n${progressTable}`,
        newTasks: newTasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
        })),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleUpdateTask(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId, taskId, title, description } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      const task = req.tasks.find((t) => t.id === taskId);
      if (!task) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Task not found" }, null, 2) }],
        };
      }

      if (task.done) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Cannot update completed task" }, null, 2) }],
        };
      }

      if (title) task.title = title;
      if (description) task.description = description;

      await this.saveTasks();

      const progressTable = this.formatTaskProgressTable(requestId);
      const result = {
        status: "task_updated",
        message: `Task ${taskId} has been updated.\n${progressTable}`,
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
        },
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }

  static async handleDeleteTask(args: any): Promise<ServerResult> {
    try {
      await this.initialize();

      const { requestId, taskId } = args;
      
      const req = this.data.requests.find((r) => r.requestId === requestId);
      if (!req) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Request not found" }, null, 2) }],
        };
      }

      const taskIndex = req.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Task not found" }, null, 2) }],
        };
      }

      if (req.tasks[taskIndex].done) {
        return {
          content: [{ type: "text", text: JSON.stringify({ status: "error", message: "Cannot delete completed task" }, null, 2) }],
        };
      }

      req.tasks.splice(taskIndex, 1);
      await this.saveTasks();

      const progressTable = this.formatTaskProgressTable(requestId);
      const result = {
        status: "task_deleted",
        message: `Task ${taskId} has been deleted.\n${progressTable}`,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true,
      };
    }
  }
}