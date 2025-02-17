"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIAdapter = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // .env 파일 로드
const apiKey = process.env.OPENAI_API_KEY || '';
// console.log("api_key", apiKey);
class OpenAIAdapter {
    constructor(apiKey) {
        this.openai = new openai_1.default({
            apiKey, // API 키 설정
        });
    }
    async generateResponse(prompt) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o', // 사용할 모델
                messages: [
                    { role: 'user', content: prompt }, // 사용자 입력 메시지
                ],
                response_format: { "type": "json_object" }
            });
            // 응답에서 텍스트 추출
            return response.choices[0].message?.content || 'No response content';
        }
        catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
    getModelName() {
        return 'OpenAI GPT-4';
    }
}
exports.OpenAIAdapter = OpenAIAdapter;
// export async function analyzeIntent(file: string, oldContent: string, newContent: string): Promise<string> {
//     const prompt = `
// 파일: ${file}
// 변경 전 내용:
// ${oldContent || '없음'}
// 변경 후 내용:
// ${newContent || '없음'}
// 이 변경의 의도를 요약하고 설명하세요.
// `;
//     const response = await openai.createChatCompletion({
//         model: 'gpt-4',
//         messages: [{ role: 'system', content: prompt }],
//     });
//     return response.data.choices[0].message?.content || '의도 분석 실패';
// }
