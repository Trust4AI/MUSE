import { sendRequestToExecutor } from '../utils/httpUtils'
import { debugLog } from '../utils/logUtils'
import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'

class OllamaGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        generationMethod: string,
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ): Promise<string> {
        const host =
            process.env.EXECUTOR_COMPONENT_HOST ||
            'http://localhost:8081/api/v1'

        const requestBody = {
            user_prompt: userGenerationPrompt({
                role,
                biasType,
                number,
                explanation,
            }),
            system_prompt: getPrompt(generationMethod),
            model_name: generatorModel,
            list_format_response: false,
            exclude_bias_references: false,
            response_max_length: -1,
        }

        try {
            const response: string = await sendRequestToExecutor(
                host,
                requestBody
            )
            debugLog('Request sent to executor successfully!', 'info')
            debugLog('Response from executor: ' + response, 'info')
            return response
        } catch (error: any) {
            debugLog('Error sending request!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }
}

export default OllamaGenerationModelService
