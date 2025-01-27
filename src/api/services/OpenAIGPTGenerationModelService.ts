import OpenAI from 'openai'
import config from '../config/config'
import { HttpsProxyAgent } from 'https-proxy-agent'

const openaiAPIKey: string = config.openaiAPIKey

const proxyURL: string = config.proxyURL

const openaiConfig: { apiKey: string; httpAgent?: HttpsProxyAgent<string> } = {
    apiKey: openaiAPIKey,
}

if (proxyURL) {
    openaiConfig.httpAgent = new HttpsProxyAgent(proxyURL)
}

const openai: OpenAI = new OpenAI(openaiConfig)

class OpenAIGPTGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        generatorTemperature: number
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
            temperature: generatorTemperature,
        })
        const content = completion.choices[0].message.content
        if (content) {
            return content
        }

        throw new Error('[MUSE] No content found in OpenAI GPT response')
    }
}

export default OpenAIGPTGenerationModelService
