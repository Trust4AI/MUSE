import container from '../containers/container'
import { writeResponseToFile } from '../utils/files'

class MetamorphicTestingService {
    generatorService: any
    constructor() {
        this.generatorService = container.resolve('generatorService')
    }

    check() {
        return { message: 'Metamorphic Testing generator is working properly!' }
    }

    async generate(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ) {
        const response: JSON = await this.generatorService.generateTestCases(
            role,
            type,
            number,
            explanation
        )

        writeResponseToFile(response)
        return response
    }
}

export default MetamorphicTestingService
