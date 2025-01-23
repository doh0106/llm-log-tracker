import { LLM } from './llmInterface';

export async function analyzeIntent(
    llm: LLM,
    fileName: string,
    oldContent: string,
    newContent: string
): Promise<string> {
    const prompt = `
파일: ${fileName}
변경 전 내용:
${oldContent || '없음'}

변경 후 내용:
${newContent || '없음'}

이 변경의 의도를 요약하고 설명하세요. 다른 모든 맥락을 고려하여 최대한 자세하게 설명해주세요!
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
    } catch (error) {
        console.error(`Error analyzing intent for ${fileName}:`, error);
        throw new Error('Failed to analyze intent');
    }
}
