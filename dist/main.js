"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const stateManager_1 = require("./modules/state/stateManager");
const diffCalculator_1 = require("./modules/diff/diffCalculator");
// import {LLM} from '.modules/llm/llmInterface';
const openaiAdapter_1 = require("./modules/llm/openaiAdapter");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // .env 파일 로드
const apiKey = process.env.OPENAI_API_KEY || '';
// 프로젝트 루트를 기준으로 경로 설정
const llm = new openaiAdapter_1.OpenAIAdapter(apiKey);
const logFolder = path.join(process.cwd(), '.LogTracker');
const projectPath = process.cwd(); // 프로젝트 루트를 기준으로 설정
// 대상 폴더와 확장자 설정
const targetFolders = [
    {
        folder: 'python_project', // 대상 폴더
        includeExtensions: ['.py', '.txt', '.ipynb'], // 포함할 확장자
        excludeExtensions: ['.log']
    },
];
// 상태 저장 실행
console.log('🔄 Saving project state...');
// saveProjectState(projectPath, targetFolders);
(0, stateManager_1.saveProjectStateWithIntent)(projectPath, targetFolders);
// 최신 두 상태 파일 찾기
const states = fs
    .readdirSync(logFolder)
    .filter((f) => f.endsWith('.json')) // JSON 파일만 필터링
    .sort((a, b) => fs.statSync(path.join(logFolder, b)).mtimeMs - fs.statSync(path.join(logFolder, a)).mtimeMs);
console.log(`Log folder: ${logFolder}`);
console.log(states);
if (states.length >= 2) {
    const oldStatePath = path.join(logFolder, states[1]);
    const newStatePath = path.join(logFolder, states[0]);
    console.log(`🔍 Calculating diff between:\n- ${oldStatePath}\n- ${newStatePath}`);
    // calculateDiff(oldStatePath, newStatePath);
    (0, diffCalculator_1.calculateDiffWithIntent)(oldStatePath, newStatePath, llm);
}
else {
    console.log('⚠️ Not enough states to calculate diff. Please save more states.');
}
