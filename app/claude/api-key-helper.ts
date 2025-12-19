import { readFile } from "node:fs/promises";

export class APIKeyHelper {
    constructor(private readonly filepath: string) {}

    // Loads an API key from a file
    async loadKey(): Promise<string> {
        const raw = await readFile(this.filepath, "utf8");

        const trimmed = raw.trim().replace(/^["']|["']$/g, "");
        if (!trimmed) {
            throw new Error(`Empty API key file: ${this.filepath}`);
        }

        const eq = trimmed.indexOf("=");
        if (eq > 0) {
            return trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
        }

        return trimmed;
    }

    async applyToEnv(envVarName = "ANTHROPIC_API_KEY"): Promise<string> {
        const key = await this.loadKey();
        process.env[envVarName] = key;
        return key;
    }
}

