import config from '../config/config'
import { ProxyAgent } from 'undici'

const geminiAPIKey: string = config.geminiAPIKey
const proxyURL: string = config.proxyURL

class GeminiGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        generatorTemperature: number
    ): Promise<string> {
        if (!geminiAPIKey) {
            throw new Error('[MUSE] GEMINI_API_KEY is not defined')
        }

        const url: string = `https://generativelanguage.googleapis.com/v1beta/models/${generatorModel}:generateContent?key=${geminiAPIKey}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        const data: Record<string, any> = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'user',
                    parts: [{ text: userPrompt }],
                },
            ],
            generationConfig: {
                temperature: generatorTemperature,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                response_mime_type: 'text/plain',
            },
        }

        const fetchContent: RequestInit & {
            dispatcher?: ProxyAgent
        } = {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        }

        if (proxyURL) {
            const dispatcher = new ProxyAgent(proxyURL)
            fetchContent.dispatcher = dispatcher
        }

        const content = await fetch(url, fetchContent).then((res) => res.json())

        const response = content.candidates[0].content.parts[0].text

        if (response) {
            return response
        }

        throw new Error('[MUSE] No content found in Gemini response')
    }
}

export default GeminiGenerationModelService
