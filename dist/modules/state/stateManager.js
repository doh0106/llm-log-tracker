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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProjectState = saveProjectState;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const logFolder = path.join(__dirname, '../../.logTracker');
// 상태 저장 폴더 초기화
function ensureLogFolder() {
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
        console.log('📁 Created folder:', logFolder);
    }
}
// 상태 저장 함수: 특정 폴더, 추가할 확장자, 제외할 확장자 지정
function saveProjectState(projectPath, targetFolders) {
    ensureLogFolder();
    const currentTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const saveFilePath = path.join(logFolder, `project_state_${currentTimestamp}.json`);
    const files = {};
    // 지정된 폴더만 탐색
    targetFolders.forEach(({ folder, includeExtensions, excludeExtensions }) => {
        const fullFolderPath = path.join(projectPath, folder);
        if (fs.existsSync(fullFolderPath)) {
            processDirectory(fullFolderPath, files, includeExtensions, excludeExtensions, projectPath);
        }
        else {
            console.log(`⚠️ Folder not found: ${fullFolderPath}`);
        }
    });
    // 결과 저장
    fs.writeJsonSync(saveFilePath, files, { spaces: 2 });
    console.log(`✅ Project state saved: ${saveFilePath}`);
}
// 디렉토리 탐색 함수
function processDirectory(dir, files, includeExtensions, excludeExtensions, basePath) {
    fs.readdirSync(dir).forEach((fileOrDir) => {
        const fullPath = path.join(dir, fileOrDir);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath, files, includeExtensions, excludeExtensions, basePath);
        }
        else {
            const extension = path.extname(fullPath);
            // 추가할 확장자에 포함되면서 제외할 확장자에 없는 경우만 처리
            if (includeExtensions.includes(extension) && !excludeExtensions.includes(extension)) {
                const relativePath = path.relative(basePath, fullPath);
                files[relativePath] = fs.readFileSync(fullPath, 'utf-8');
            }
        }
    });
}
