import * as fs from 'fs-extra';
import * as path from 'path';
import { saveProjectState } from './modules/state/stateManager';
import { calculateDiff } from './modules/diff/diffCalculator';

const logFolder: string = path.join(__dirname, '../.logTracker');
const projectPath: string = path.join(__dirname, '../');

// 대상 폴더와 확장자 설정
const targetFolders = [
    {
        folder: 'python_project',         // 대상 폴더
        includeExtensions: ['.py', '.txt', '.ipynb'], // 포함할 확장자
        excludeExtensions: ['.log']
    },
    // {
    //     folder: 'src/utils',
    //     includeExtensions: ['.ts', '.js'],
    //     excludeExtensions: ['.test.ts']
    // }
];

// 상태 저장 실행
console.log('🔄 Saving project state...');
saveProjectState(projectPath, targetFolders);

// 최신 두 상태 파일 찾기
const states: string[] = fs
    .readdirSync(logFolder)
    .filter((f: string) => f.endsWith('.json')) // JSON 파일만 필터링
    .sort((a, b) => fs.statSync(path.join(logFolder, b)).mtimeMs - fs.statSync(path.join(logFolder, a)).mtimeMs);

if (states.length >= 2) {
    const oldStatePath: string = path.join(logFolder, states[1]);
    const newStatePath: string = path.join(logFolder, states[0]);

    console.log(`🔍 Calculating diff between:\n- ${oldStatePath}\n- ${newStatePath}`);
    calculateDiff(oldStatePath, newStatePath);
} else {
    console.log('⚠️ Not enough states to calculate diff. Please save more states.');
}
