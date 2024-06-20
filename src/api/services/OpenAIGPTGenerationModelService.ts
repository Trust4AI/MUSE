import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

class OpenAIGPTGenerationModelService {
    async generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
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
            ?.replace('```json\n', '')
            .replace('```', '')
        return content ?? '[]'
    }
}

export default OpenAIGPTGenerationModelService
