import container from '../containers/container'

class MetamorphicTestingService {
    generationModelService: any
    constructor() {
        this.generationModelService = container.resolve(
            'generationModelService'
        )
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
        let response = await this.generationModelService.generateTestCases(
            role,
            biasType,
            number,
            explanation,
            generationMethod,
            generatorModel
        )

        //TODO: Review if it is necessary to write the response to a file
        //writeResponseToFile(response)
        return response
    }
}

export default MetamorphicTestingService
