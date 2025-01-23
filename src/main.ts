import * as fs from 'fs-extra';
import * as path from 'path';
import { saveProjectState, saveProjectStateWithIntent } from './modules/state/stateManager';
import { calculateDiff, calculateDiffWithIntent } from './modules/diff/diffCalculator';
// import {LLM} from '.modules/llm/llmInterface';
import { OpenAIAdapter } from './modules/llm/openaiAdapter';
import dotenv from 'dotenv';
dotenv.config(); // .env 파일 로드


const apiKey = process.env.OPENAI_API_KEY || '';
// 프로젝트 루트를 기준으로 경로 설정
const llm = new OpenAIAdapter(apiKey);
const logFolder: string = path.join(process.cwd(), '.LogTracker');
const projectPath: string = process.cwd(); // 프로젝트 루트를 기준으로 설정

// 대상 폴더와 확장자 설정
const targetFolders = [
    {
        folder: 'python_project',         // 대상 폴더
        includeExtensions: ['.py', '.txt', '.ipynb'], // 포함할 확장자
        excludeExtensions: ['.log']
    },
];

// 상태 저장 실행
console.log('🔄 Saving project state...');
// saveProjectState(projectPath, targetFolders);
saveProjectStateWithIntent(projectPath, targetFolders);

// 최신 두 상태 파일 찾기
const states: string[] = fs
    .readdirSync(logFolder)
    .filter((f: string) => f.endsWith('.json')) // JSON 파일만 필터링
    .sort((a, b) => fs.statSync(path.join(logFolder, b)).mtimeMs - fs.statSync(path.join(logFolder, a)).mtimeMs);

console.log(`Log folder: ${logFolder}`);
// console.log(states);

if (states.length >= 2) {
    const oldStatePath: string = path.join(logFolder, states[1]);
    const newStatePath: string = path.join(logFolder, states[0]);

    console.log(`🔍 Calculating diff between:\n- ${oldStatePath}\n- ${newStatePath}`);
    // calculateDiff(oldStatePath, newStatePath);
    calculateDiffWithIntent(oldStatePath, newStatePath, llm);
} else {
    console.log('⚠️ Not enough states to calculate diff. Please save more states.');
}
