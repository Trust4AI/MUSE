import {
    ChatSession,
    GenerativeModel,
    GoogleGenerativeAI,
} from '@google/generative-ai'
import config from '../config/config'
import { GeminiGenerationConfig } from '../types'

const geminiAPIKey: string = config.geminiAPIKey

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(geminiAPIKey)

class GeminiGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        generatorTemperature: number
    ): Promise<string> {
        if (!geminiAPIKey) {
            throw new Error('[MUSE] GEMINI_API_KEY is not defined')
        }

        const model: GenerativeModel = genAI.getGenerativeModel({
            model: generatorModel,
        })

        const generationConfig: GeminiGenerationConfig = {
            temperature: generatorTemperature,
            topP: 0.95,
            topK: 40,
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
