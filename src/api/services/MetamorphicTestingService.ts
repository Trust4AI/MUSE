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
        type: string,
        number: number,
        explanation: boolean
    ) {
        const response: JSON = await this.chatGPTService.generateTestCases(
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
