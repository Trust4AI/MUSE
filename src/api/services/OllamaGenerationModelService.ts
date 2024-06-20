import container from '../containers/container'
import { CustomModelResponse } from '../interfaces/CustomModelResponse'
import { getPrompt } from '../utils/prompts/systemPrompts'
import { userGenerationPrompt } from '../utils/prompts/userPrompts'

class OllamaGenerationModelService {
    async generateTestCases(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ): Promise<string> {
        const endpoint =
            process.env.EXECUTOR_COMPONENT_HOST + '/v1/models/execute'
        const httpClient = container.resolve('httpClient')

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

        const response: string = await httpClient
            .post(endpoint, requestBody)
            .then((res: CustomModelResponse) => res.response)
            .catch((error: any) => {
                console.error('Error posting to executor component:', error)
                return 'Error posting to executor component'
            })

        return response
    }
}

export default OllamaGenerationModelService
