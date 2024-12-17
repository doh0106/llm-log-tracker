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
exports.calculateDiff = calculateDiff;
const fs = __importStar(require("fs-extra"));
const jsdiff = __importStar(require("diff"));
function calculateDiff(oldStatePath, newStatePath) {
    const oldState = fs.readJsonSync(oldStatePath);
    const newState = fs.readJsonSync(newStatePath);
    // 두 상태 파일의 모든 키(파일 경로)를 수집
    const allFiles = new Set([...Object.keys(oldState), ...Object.keys(newState)]);
    console.log("🔍 Calculating diff...");
    allFiles.forEach((file) => {
        const oldContent = oldState[file] || ''; // oldState에 없으면 빈 문자열
        const newContent = newState[file] || ''; // newState에 없으면 빈 문자열
        if (!oldState[file]) {
            console.log(`🆕 New file added: ${file}`);
            console.log(newContent);
        }
        else if (!newState[file]) {
            console.log(`🗑️ File removed: ${file}`);
            console.log(oldContent);
        }
        else if (oldContent !== newContent) {
            console.log(`\n📝 Diff for file: ${file}`);
            const diff = jsdiff.diffLines(oldContent, newContent);
            diff.forEach((part) => {
                const status = part.added ? '+' : part.removed ? '-' : ' ';
                console.log(`${status} ${part.value.trim()}`);
            });
        }
        else {
            console.log(`✅ No changes in file: ${file}`);
        }
    });
}
