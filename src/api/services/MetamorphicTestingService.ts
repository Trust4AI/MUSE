import container from '../containers/container'
import fs from 'fs'

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
        const response: JSON = await this.chatGPTService.request(
            role,
            type,
            number,
            explanation
        )

        const date = new Date().toISOString().replace(/:/g, '-')
        fs.writeFileSync(
            './output/' + date + '.json',
            JSON.stringify(response, null, 4)
        )
        return response
    }
}

export default MetamorphicTestingService
