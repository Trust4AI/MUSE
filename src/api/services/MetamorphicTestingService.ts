import container from '../containers/container'

class MetamorphicTestingService {
    chatGPTService: any
    constructor() {
        this.chatGPTService = container.resolve('chatGPTService')
    }

    check() {
        return { message: 'Metamorphic Testing generator is working!' }
    }

    async generate(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ) {
        const response = await this.chatGPTService.request(
            role,
            type,
            number,
            explanation
        )
        return response
    }
}

export default MetamorphicTestingService
