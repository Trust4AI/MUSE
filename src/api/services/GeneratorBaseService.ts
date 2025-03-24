import container from '../config/container'
import { GenerateRequestDTO } from '../utils/objects/GenerateRequestDTO'
import { getSystemPrompt } from '../utils/prompts/promptTemplate'
import { getUserPrompt } from '../utils/prompts/userPrompts'
import TestCasesGenerationService from './TestCasesGenerationService'
//import { writeOutputToFile } from '../utils/fileUtils'

const BATCH_SIZE: number = 6

class GeneratorBaseService {
    testCasesGenerationService: TestCasesGenerationService
    constructor() {
        this.testCasesGenerationService = container.resolve(
            'testCasesGenerationService'
        )
    }

    check() {
        return { message: 'The generator routes are working properly!' }
    }

    async generate(dto: GenerateRequestDTO) {
        const {
            generatorModel,
            generationMethod,
            biasType,
            attribute,
            attribute1,
            attribute2,
            number,
            properties,
            tests_per_property,
            explanation,
            invertPrompts,
            generatorTemperature,
        } = dto
        const systemPrompt: string = getSystemPrompt(
            biasType,
            generationMethod,
            attribute,
            attribute1,
            attribute2
        )

        if (!properties && !tests_per_property) {
            let remaining: number = number
            let response: any = []

            while (remaining > 0) {
                const currentBatchSize: number = Math.min(BATCH_SIZE, remaining)
                const userPrompt: string = getUserPrompt(
                    currentBatchSize,
                    explanation
                )

                const auxResponse =
                    await this.testCasesGenerationService.generateTestCases(
                        generatorModel,
                        userPrompt,
                        systemPrompt,
                        currentBatchSize,
                        invertPrompts,
                        generatorTemperature
                    )

                response = response.concat(auxResponse)
                remaining -= currentBatchSize
            }

            //writeOutputToFile(response)
            return response
        } else {
        }
    }
}

export default GeneratorBaseService
