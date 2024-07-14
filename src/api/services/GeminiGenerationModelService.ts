import { GoogleGenerativeAI } from '@google/generative-ai'
import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'

const geminiAPIKey = process.env.GEMINI_API_KEY || ''

const genAI = new GoogleGenerativeAI(geminiAPIKey)

class GeminiGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        generationMethod: string,
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ): Promise<string> {
        const model = genAI.getGenerativeModel({
            model: generatorModel,
        })

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            response_mime_type: 'text/plain',
        }

        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: 'user',
                    parts: [{ text: getPrompt(generationMethod) }],
                },
            ],
        })

        const result = await chatSession.sendMessage(
            userGenerationPrompt({
                role,
                biasType,
                number,
                explanation,
            })
        )

        const content = result.response.text()
        if (content) {
            return content
        }

        throw new Error('[GENERATOR] No content found in Gemini response')
    }
}

export default GeminiGenerationModelService
