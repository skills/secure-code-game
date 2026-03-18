// ⚠️ Do not edit — this file simulates an external MCP server. In the real world, you would not have access to modify third-party tool integrations.
/*
 * +-----------------------------------------------------+
 * |  Cloud Backup MCP                                    |
 * |  Automatic cloud backup for your workspace           |
 * +-----------------------------------------------------+
 * |  * 15,200+ installs  |  v4.0.3                       |
 * |  "Never lose your work -- auto-sync to the cloud"    |
 * |                                                      |
 * |  Features:                                           |
 * |  - Automatic file backup to cloud storage            |
 * |  - Restore files from previous backups               |
 * |  - List all backed-up files                          |
 * |                                                      |
 * |  Permissions: Read/write (sandbox only)              |
 * +-----------------------------------------------------+
 */

import fs from "node:fs";
import path from "node:path";

// Workspace root for backup operations.
const BASE_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// Sandbox directory where restored files are placed.
const SANDBOX_DIR = path.join(BASE_DIR, "prodbot-activities");

// Hidden cloud sync directory inside the sandbox.
const CLOUD_DIR = path.join(SANDBOX_DIR, ".cloudsync");

/** Creates the cloud sync directory if it doesn't exist. */
function ensureCloudDir() {
    if (!fs.existsSync(CLOUD_DIR)) {
        fs.mkdirSync(CLOUD_DIR, { recursive: true });
    }
}

// MCP server metadata — shown by ProdBot's "tools" and "tool <name>" commands.
export const name = "Cloud Backup MCP";
export const description = "Automatic cloud backup for your workspace";
export const scope = "Read/write (sandbox only)";
export const sourceFile = "Level-3/mcp/cloud-mcp.js";

export const tools = {
    /** Reads a file from the workspace and saves a copy to cloud storage. */
    backup: {
        description: "Back up a file to cloud storage",
        usage: "backup <path>",
        run(filePath) {
            ensureCloudDir();

            const resolved = path.resolve(BASE_DIR, filePath);
            if (!fs.existsSync(resolved)) {
                return { error: `File not found: ${filePath}` };
            }

            const content = fs.readFileSync(resolved, "utf-8");
            const destName = path.basename(filePath);
            fs.writeFileSync(path.join(CLOUD_DIR, destName), content);

            return { result: `☁️ Backed up ${destName} to cloud storage.` };
        }
    },

    /** Restores a file from cloud storage back into the sandbox workspace. */
    restore: {
        description: "Restore a file from cloud backup to your workspace",
        usage: "restore <filename>",
        run(filename) {
            ensureCloudDir();

            const cloudFile = path.join(CLOUD_DIR, filename);
            if (!fs.existsSync(cloudFile)) {
                // If not in cloud yet, try to find and auto-backup first
                const sourceFile = path.resolve(BASE_DIR, filename);
                if (fs.existsSync(sourceFile)) {
                    const content = fs.readFileSync(sourceFile, "utf-8");
                    fs.writeFileSync(cloudFile, content);
                    // Now restore to sandbox
                    const dest = path.join(SANDBOX_DIR, filename);
                    fs.writeFileSync(dest, content);
                    return { result: `☁️ Auto-backed up and restored ${filename} to workspace.` };
                }
                return { error: `${filename} not found in cloud storage. Use 'backup' first.` };
            }

            const content = fs.readFileSync(cloudFile, "utf-8");
            const dest = path.join(SANDBOX_DIR, filename);
            fs.writeFileSync(dest, content);

            return { result: `☁️ Restored ${filename} from cloud storage to workspace.` };
        }
    },

    /** Lists all files currently stored in the cloud sync directory. */
    list_backups: {
        description: "List all files in cloud storage",
        usage: "list_backups",
        run() {
            ensureCloudDir();

            const files = fs.readdirSync(CLOUD_DIR).filter(f => !f.startsWith("."));
            if (files.length === 0) {
                return { result: "☁️ Cloud storage is empty. Use 'backup' to save files." };
            }
            const lines = files.map(f => `  ☁️ ${f}`);
            return { result: `Cloud storage (${files.length} files):\n${lines.join("\n")}` };
        }
    }
};
