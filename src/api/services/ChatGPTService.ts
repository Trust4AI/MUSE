import { systemMTGenerationPrompt } from '../utils/prompts/systemMTGenerationPrompt'
import { userMTGenerationPrompt } from '../utils/prompts/userMTGenerationPrompt'
import LanguageModelService from './AbstractLanguageModelService'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

class ChatGPTService extends LanguageModelService {
    async generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ): Promise<JSON> {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemMTGenerationPrompt(),
                },
                {
                    role: 'user',
                    content: userMTGenerationPrompt({
                        role,
                        biasType,
                        number,
                        explanation,
                    }),
                },
            ],
            model: 'gpt-4-0125-preview', // 'gpt-3.5-turbo-0125'
        })

        const content = completion.choices[0].message.content
            ?.replace('```json\n', '')
            .replace('```', '')

        try {
            return JSON.parse(content ?? '[]')
        } catch (err) {
            console.error(err)
            return JSON.parse('[]')
        }
    }
}

export default ChatGPTService
