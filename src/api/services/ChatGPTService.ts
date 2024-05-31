import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'
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
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ): Promise<JSON> {
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

        try {
            return JSON.parse(content ?? '[]')
        } catch (err) {
            console.error(err)
            return JSON.parse('[]')
        }
    }
}

export default ChatGPTService
