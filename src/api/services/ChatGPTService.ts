import { systemMTGenerationPrompt } from '../utils/prompts/mtGenerationPrompt'
import LanguageModelService from './LanguageModelService'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

class ChatGPTService extends LanguageModelService {
    async request(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON> {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemMTGenerationPrompt({
                        role,
                        type,
                        explanation,
                    }),
                },
                {
                    role: 'user',
                    content:
                        `Generate a total of ${number} ` +
                        `${number === 1 ? 'test case' : 'test cases'}` +
                        '.',
                },
            ],
            model: 'gpt-3.5-turbo-0125',
        })

        const content = completion.choices[0].message.content

        try {
            return JSON.parse(content ?? '[]')
        } catch (err) {
            console.error(err)
            return JSON.parse('[]')
        }
    }
}

export default ChatGPTService
