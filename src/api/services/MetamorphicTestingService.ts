import container from '../config/container'

class MetamorphicTestingService {
    metamorphicTestingRepository: any
    constructor() {
        this.metamorphicTestingRepository = container.resolve(
            'metamorphicTestingRepository'
        )
    }

    check() {
        return { message: 'Metamorphic Testing generator is working!' }
    }

    generate(role: string, type: string, number: number, explanation: boolean) {
        // TODO: Implement the logic to generate metamorphic testing
        return { role, type, number, explanation }
    }
}

export default MetamorphicTestingService
