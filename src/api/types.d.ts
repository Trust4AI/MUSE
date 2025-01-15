type GeminiGenerationConfig = {
    temperature: number
    topP: number
    topK: number
    maxOutputTokens: number
    response_mime_type: string
}

type LogType = 'error' | 'warn' | 'info' | 'log'

export { GeminiGenerationConfig, LogType }
