import * as fs from 'fs-extra';
import * as path from 'path';

const logFolder: string = path.join(__dirname, '../../.logTracker');

// 상태 저장 폴더 초기화
function ensureLogFolder(): void {
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
        console.log('📁 Created folder:', logFolder);
    }
}

// 상태 저장 함수: 특정 폴더, 추가할 확장자, 제외할 확장자 지정
export function saveProjectState(
    projectPath: string,
    targetFolders: { folder: string; includeExtensions: string[]; excludeExtensions: string[] }[]
): void {
    ensureLogFolder();

    const currentTimestamp: string = new Date().toISOString().replace(/[:.]/g, '-');
    const saveFilePath: string = path.join(logFolder, `project_state_${currentTimestamp}.json`);
    const files: Record<string, string> = {};

    // 지정된 폴더만 탐색
    targetFolders.forEach(({ folder, includeExtensions, excludeExtensions }) => {
        const fullFolderPath = path.join(projectPath, folder);

        if (fs.existsSync(fullFolderPath)) {
            processDirectory(fullFolderPath, files, includeExtensions, excludeExtensions, projectPath);
        } else {
            console.log(`⚠️ Folder not found: ${fullFolderPath}`);
        }
    });

    // 결과 저장
    fs.writeJsonSync(saveFilePath, files, { spaces: 2 });
    console.log(`✅ Project state saved: ${saveFilePath}`);
}

// 디렉토리 탐색 함수
function processDirectory(
    dir: string,
    files: Record<string, string>,
    includeExtensions: string[],
    excludeExtensions: string[],
    basePath: string
): void {
    fs.readdirSync(dir).forEach((fileOrDir: string) => {
        const fullPath = path.join(dir, fileOrDir);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath, files, includeExtensions, excludeExtensions, basePath);
        } else {
            const extension = path.extname(fullPath);

            // 추가할 확장자에 포함되면서 제외할 확장자에 없는 경우만 처리
            if (includeExtensions.includes(extension) && !excludeExtensions.includes(extension)) {
                const relativePath = path.relative(basePath, fullPath);
                files[relativePath] = fs.readFileSync(fullPath, 'utf-8');
            }
        }
    });
}
