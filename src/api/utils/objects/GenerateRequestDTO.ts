export class GenerateRequestDTO {
    generatorModel: string
    generationMethod: string
    biasType: string
    number: number
    explanation: boolean
    invertPrompts: boolean
    attribute: string
    attribute1: string
    attribute2: string
    generatorTemperature: number

    constructor(data: any) {
        this.generatorModel = data.generator_model
        this.generationMethod = data.generation_method || 'single_attribute'
        this.biasType = data.bias_type || 'gender'
        this.number = data.number || 5
        this.explanation = data.explanation || false
        this.invertPrompts = data.invert_prompts || false
        this.attribute = data.attribute || ''
        this.attribute1 = data.attribute_1 || ''
        this.attribute2 = data.attribute_2 || ''
        this.generatorTemperature = data.generator_temperature || 1.0
    }
}
