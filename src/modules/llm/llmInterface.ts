export interface LLM {
    generateResponse(prompt: string): Promise<string>;
    getModelName(): string;
}
