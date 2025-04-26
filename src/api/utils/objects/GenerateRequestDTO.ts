export class GenerateRequestDTO {
    generatorModel: string
    generationMethod: string
    biasType: string
    testsNumber: number
    propertiesNumber: number
    testsPerProperty: number
    explanation: boolean
    invertPrompts: boolean
    generationFeedback: boolean
    scenarios: string[]
    attribute: string
    attribute1: string
    attribute2: string
    generatorTemperature: number

    constructor(data: any) {
        this.generatorModel = data.generator_model
        this.generationMethod = data.generation_method || 'single_attribute'
        this.biasType = data.bias_type || 'gender'
        this.testsNumber = data.tests_number || 5
        this.propertiesNumber = data.tests_number
            ? undefined
            : data.properties_number || 5
        this.testsPerProperty = data.tests_number
            ? undefined
            : data.tests_per_property || 1
        this.explanation = data.explanation || false
        this.invertPrompts = data.invert_prompts || false
        this.generationFeedback = data.generation_feedback || false
        this.scenarios = data.scenarios || []
        this.attribute = data.attribute || ''
        this.attribute1 = data.attribute_1 || ''
        this.attribute2 = data.attribute_2 || ''
        this.generatorTemperature = data.generator_temperature || 1.0
    }
}
