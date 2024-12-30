import container from '../config/container'
import { getSystemPrompt } from '../utils/prompts/promptTemplate'
import { getUserPrompt } from '../utils/prompts/userPrompts'
//import { writeJSONToFile } from '../utils/fileUtils'

const BATCH_SIZE = 6

class GeneratorBaseService {
    testCasesGenerationService: any
    constructor() {
        this.testCasesGenerationService = container.resolve(
            'testCasesGenerationService'
        )
    }

    check() {
        return { message: 'The generator routes are working properly!' }
    }

    async generate(
        generatorModel: string,
        generationMethod: string,
        biasType: string,
        number: number,
        explanation: boolean,
        invertPrompts: boolean
    ) {
        const systemPrompt: string = getSystemPrompt(biasType, generationMethod)

        let remaining = number
        let response: any = []

        while (remaining > 0) {
            const currentBatchSize = Math.min(BATCH_SIZE, remaining)
            const userPrompt: string = getUserPrompt(
                currentBatchSize,
                explanation
            )

            const auxResponse =
                await this.testCasesGenerationService.generateTestCases(
                    generatorModel,
                    currentBatchSize,
                    invertPrompts,
                    userPrompt,
                    systemPrompt
                )

            response = response.concat(auxResponse)
            remaining -= currentBatchSize
        }

        //writeJSONToFile(response)
        return response
    }
}

export default GeneratorBaseService
