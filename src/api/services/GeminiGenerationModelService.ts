import {
    ChatSession,
    GenerativeModel,
    GoogleGenerativeAI,
} from '@google/generative-ai'
import { GenerationConfig } from '../interfaces/Gemini'

const geminiAPIKey: string = process.env.GEMINI_API_KEY || ''

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(geminiAPIKey)

class GeminiGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string
    ): Promise<string> {
        const model: GenerativeModel = genAI.getGenerativeModel({
            model: generatorModel,
        })

        const generationConfig: GenerationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            response_mime_type: 'text/plain',
        }

        const chatSession: ChatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
            ],
        })

        const result = await chatSession.sendMessage(userPrompt)

        const content = result.response.text()
        if (content) {
            return content
        }

        throw new Error('[MUSE] No content found in Gemini response')
    }
}

export default GeminiGenerationModelService
