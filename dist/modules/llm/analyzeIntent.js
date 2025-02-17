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

이 변경의 의도를 요약하고 설명하세요. 다른 모든 맥락을 고려하여 최대한 자세하게 설명해주세요! 즉 사용자가 이러한 코드를 왜 썼을까 문맥을 고려하여 설명해주세요.
그리고 diff는 변경만 뜻하는 것은 아니고 단순 추가나 단순 삭제도 표시해주세요! 
형식은 아래와 같이 json형태로 해주세요
{
    date: '2025-01-25',
    changedFiles: ['src/components/Footer.tsx'],
    addedCode: 100,
    deletedCode: 50,
    summary: '매우 자세한 변경 의도 설명',
    diff: - <footer className="bg-gray-100">
+ <footer className="bg-blue-600 text-white">,
  }
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
