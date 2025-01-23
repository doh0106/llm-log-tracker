import * as fs from 'fs-extra';
import * as jsdiff from 'diff';
import { LLM } from '../llm/llmInterface';
import { analyzeIntent } from '../llm/analyzeIntent';

// 공통 Diff 계산 로직
function processFileDiff(
    file: string,
    oldContent: string,
    newContent: string
): void {
    if (!oldContent) {
        console.log(`🆕 New file added: ${file}`);
        console.log(newContent);
    } else if (!newContent) {
        console.log(`🗑️ File removed: ${file}`);
        console.log(oldContent);
    } else if (oldContent !== newContent) {
        console.log(`\n📝 Diff for file: ${file}`);
        const diff = jsdiff.diffLines(oldContent, newContent);
        diff.forEach((part) => {
            const status: string = part.added ? '+' : part.removed ? '-' : ' ';
            // console.log(`${status} ${part.value.trim()}`);
        });
    } else {
        console.log(`✅ No changes in file: ${file}`);
    }
}


// Diff 계산 로직 (기본 버전)
export function calculateDiff(oldStatePath: string, newStatePath: string): void {
    const oldState: Record<string, string> = fs.readJsonSync(oldStatePath);
    const newState: Record<string, string> = fs.readJsonSync(newStatePath);

    const allFiles = new Set([...Object.keys(oldState), ...Object.keys(newState)]);

    console.log("🔍 Calculating diff...");

    allFiles.forEach((file) => {
        const oldContent = oldState[file] || '';
        const newContent = newState[file] || '';
        processFileDiff(file, oldContent, newContent);
    });
}

// ... existing code ...

export async function calculateDiffWithIntent(
    oldStatePath: string,
    newStatePath: string,
    llm: LLM
): Promise<void> {
    const oldState = fs.readJsonSync(oldStatePath);
    const newState = fs.readJsonSync(newStatePath);

    const allFiles = new Set([...Object.keys(oldState), ...Object.keys(newState)]);

    console.log("🔍 Calculating diff...");

    for (const file of allFiles) {
        // 객체에서 content 필드를 추출
        const oldContent = oldState[file]?.content || '';
        const newContent = newState[file]?.content || '';

        // Diff 처리
        processFileDiff(file, oldContent, newContent);

        // LLM을 통한 의도 분석
        if (!oldContent || !newContent || oldContent !== newContent) {
            const intent = await analyzeIntent(llm, file, oldContent, newContent);
            console.log(`💡 LLM Suggested Intent: ${intent}`);
        }
    }
}