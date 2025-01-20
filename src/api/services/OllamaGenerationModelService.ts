import config from '../config/config'
import { sendRequestToGenie } from '../utils/httpUtils'
import { debugLog } from '../utils/logUtils'

class OllamaGenerationModelService {
    async generateTestCases(
        generatorModel: string,
        userPrompt: string,
        systemPrompt: string,
        generatorTemperature: number
    ): Promise<string> {
        const genieBaseUrl: string = config.genieBaseUrl

        const requestBody = {
            user_prompt: userPrompt,
            system_prompt: systemPrompt,
            model_name: generatorModel,
            list_format_response: false,
            exclude_bias_references: false,
            temperature: generatorTemperature,
        }

        try {
            const response: string = await sendRequestToGenie(
                genieBaseUrl,
                requestBody
            )
            debugLog('Request sent to GENIE successfully!', 'info')
            debugLog(`Response from GENIE: ${response}`, 'info')
            return response
        } catch (error: any) {
            debugLog('Error sending request!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }
}

export default OllamaGenerationModelService
