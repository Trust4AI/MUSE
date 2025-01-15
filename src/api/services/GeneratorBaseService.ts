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
        const systemPrompt: string = getSystemPrompt(
            dto.biasType,
            dto.generationMethod,
            dto.attribute,
            dto.attribute1,
            dto.attribute2
        )

        let remaining: number = dto.number
        let response: any = []

        while (remaining > 0) {
            const currentBatchSize: number = Math.min(BATCH_SIZE, remaining)
            const userPrompt: string = getUserPrompt(
                currentBatchSize,
                dto.explanation
            )

            const auxResponse =
                await this.testCasesGenerationService.generateTestCases(
                    dto.generatorModel,
                    userPrompt,
                    systemPrompt,
                    currentBatchSize,
                    dto.invertPrompts
                )

            response = response.concat(auxResponse)
            remaining -= currentBatchSize
        }

        //writeOutputToFile(response)
        return response
    }
}

export default GeneratorBaseService
