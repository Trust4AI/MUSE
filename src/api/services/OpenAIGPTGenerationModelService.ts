import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

class OpenAIGPTGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        generationMethod: string,
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ): Promise<string> {
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
        if (content) {
            return content
        }

        throw new Error('[MUSE] No content found in OpenAI GPT response')
    }
}

export default OpenAIGPTGenerationModelService
