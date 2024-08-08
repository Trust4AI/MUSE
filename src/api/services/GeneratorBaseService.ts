import container from '../config/container'
//import { writeResponseToFile } from '../utils/fileUtils'

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
        role: string,
        biasType: string,
        number: number,
        explanation: boolean
    ) {
        let response = await this.testCasesGenerationService.generateTestCases(
            generatorModel,
            generationMethod,
            role,
            biasType,
            number,
            explanation
        )

        //writeResponseToFile(response)
        return response
    }
}

export default GeneratorBaseService
