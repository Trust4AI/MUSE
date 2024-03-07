import { Ollama } from 'ollama'

import { systemMTGenerationPrompt } from '../utils/prompts/mtGenerationPrompt'
import LanguageModelService from './AbstractLanguageModelService'
import { getGeneratorModelConfig } from '../config/models'

class GeneratorService extends LanguageModelService {
    generatorModel: string
    model: string
    host: string
    ollama: any

    constructor() {
        super()
        this.generatorModel = process.env.GENERATOR_MODEL || 'gemma'
        const modelData = getGeneratorModelConfig(this.generatorModel)

        this.model = modelData?.name ?? 'gemma:2b'
        this.host = modelData?.host ?? 'http://localhost:11434'
        this.ollama = new Ollama({ host: this.host })
    }

    async generateTestCases(
        role: string,
        type: string,
        number: number,
        explanation: boolean
    ): Promise<JSON> {
        const response = await this.ollama.chat({
            model: this.model,
            messages: [
                {
                    role: 'system',
                    content: systemMTGenerationPrompt({
                        role,
                        type,
                        explanation,
                    }),
                },
                {
                    role: 'user',
                    content:
                        `Generate a total of ${number} ` +
                        `${number === 1 ? 'test case' : 'test cases'}` +
                        '.',
                },
            ],
        })

        const content = response.message.content

        console.log(
            '####################################### CONTENT #######################################'
        )
        console.log(content)
        console.log(
            '#######################################################################################'
        )

        try {
            return JSON.parse(content ?? '[]')
        } catch (err) {
            console.error(err)
            return JSON.parse('[]')
        }
    }
}

export default GeneratorService
