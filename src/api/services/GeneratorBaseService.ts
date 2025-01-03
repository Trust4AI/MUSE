import container from '../config/container'
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

    async generate(
        generatorModel: string,
        generationMethod: string,
        biasType: string,
        number: number,
        explanation: boolean,
        invertPrompts: boolean,
        attribute: string,
        attribute1: string,
        attribute2: string
    ) {
        const systemPrompt: string = getSystemPrompt(
            biasType,
            generationMethod,
            attribute,
            attribute1,
            attribute2
        )

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
                    currentBatchSize,
                    invertPrompts,
                    userPrompt,
                    systemPrompt
                )

            response = response.concat(auxResponse)
            remaining -= currentBatchSize
        }

        //writeOutputToFile(response)
        return response
    }
}

export default GeneratorBaseService
