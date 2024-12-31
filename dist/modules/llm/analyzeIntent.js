"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeIntent = analyzeIntent;
async function analyzeIntent(llm, fileName, oldContent, newContent) {
    const prompt = `
파일: ${fileName}
변경 전 내용:
${oldContent || '없음'}

변경 후 내용:
${newContent || '없음'}

이 변경의 의도를 요약하고 설명하세요.
`;
    // LLM 인스턴스를 활용하여 응답 생성
    try {
        return await llm.generateResponse(prompt);
    }
    catch (error) {
        console.error(`Error analyzing intent for ${fileName}:`, error);
        throw new Error('Failed to analyze intent');
    }
}
