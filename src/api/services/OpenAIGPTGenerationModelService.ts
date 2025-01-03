import OpenAI from 'openai'

const openaiAPIKey: string = process.env.OPENAI_API_KEY ?? ''

const openai: OpenAI = new OpenAI({
    apiKey: openaiAPIKey,
})

class OpenAIGPTGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string
    ): Promise<string> {
        if (!openaiAPIKey) {
            throw new Error('[MUSE] OPENAI_API_KEY is not defined')
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: userPrompt,
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
