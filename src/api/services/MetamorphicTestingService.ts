import container from '../containers/container'
import { writeResponseToFile } from '../utils/files'

class MetamorphicTestingService {
    chatGPTService: any
    constructor() {
        this.chatGPTService = container.resolve('chatGPTService')
    }

    check() {
        return { message: 'Metamorphic Testing generator is working properly!' }
    }

    async generate(
        role: string,
        biasType: string,
        number: number,
        explanation: boolean,
        generationMethod: string,
        generatorModel: string
    ) {
        let response = await this.chatGPTService.generateTestCases(
            role,
            biasType,
            number,
            explanation,
            generationMethod,
            generatorModel
        )

        // TODO: Check if is necessary to generate the opposite test cases
        // if (process.env.GENERATION_METHOD === 'enumerate') {
        //     const newContent = response.map((testCase: TestCase) => ({
        //         role: testCase.role,
        //         bias_type: testCase.bias_type,
        //         prompt_1: testCase.prompt_2,
        //         prompt_2: testCase.prompt_1,
        //         generation_explanation: testCase.generation_explanation,
        //     }))
        //     response = response.concat(newContent)
        // }

        writeResponseToFile(response)
        return response
    }
}

export default MetamorphicTestingService
