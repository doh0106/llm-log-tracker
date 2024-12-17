import * as fs from 'fs-extra';
import * as jsdiff from 'diff';

export function calculateDiff(oldStatePath: string, newStatePath: string): void {
    const oldState: Record<string, string> = fs.readJsonSync(oldStatePath);
    const newState: Record<string, string> = fs.readJsonSync(newStatePath);

    // 두 상태 파일의 모든 키(파일 경로)를 수집
    const allFiles = new Set([...Object.keys(oldState), ...Object.keys(newState)]);

    console.log("🔍 Calculating diff...");

    allFiles.forEach((file: string) => {
        const oldContent: string = oldState[file] || ''; // oldState에 없으면 빈 문자열
        const newContent: string = newState[file] || ''; // newState에 없으면 빈 문자열

        if (!oldState[file]) {
            console.log(`🆕 New file added: ${file}`);
            console.log(newContent);
        } else if (!newState[file]) {
            console.log(`🗑️ File removed: ${file}`);
            console.log(oldContent);
        } else if (oldContent !== newContent) {
            console.log(`\n📝 Diff for file: ${file}`);
            const diff = jsdiff.diffLines(oldContent, newContent);
            diff.forEach((part) => {
                const status: string = part.added ? '+' : part.removed ? '-' : ' ';
                console.log(`${status} ${part.value.trim()}`);
            });
        } else {
            console.log(`✅ No changes in file: ${file}`);
        }
    });
}
