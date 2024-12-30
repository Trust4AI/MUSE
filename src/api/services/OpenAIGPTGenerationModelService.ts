import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

class OpenAIGPTGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string
    ): Promise<string> {
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
