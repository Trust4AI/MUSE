import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'
import LanguageModelService from './AbstractLanguageModelService'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '5', 10)

class ChatGPTService extends LanguageModelService {
    async generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ): Promise<JSON> {
        let attempts = 0

        while (attempts < MAX_RETRIES) {
            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: getPrompt(generationMethod),
                        },
                        {
                            role: 'user',
                            content: userGenerationPrompt({
                                role,
                                biasType,
                                number,
                                explanation,
                            }),
                        },
                    ],
                    model: generatorModel,
                })
                const content = completion.choices[0].message.content
                    ?.replace('```json\n', '')
                    .replace('```', '')
                const jsonContent = JSON.parse(content ?? '[]')
                if (jsonContent.length > 0) {
                    return jsonContent
                }
            } catch (error) {
                console.warn(
                    `Attempt ${attempts + 1} failed. Retrying...`,
                    error
                )
            }
            attempts++
        }
        console.error('Max retries reached')
        return JSON.parse('[]')
    }
}

export default ChatGPTService
