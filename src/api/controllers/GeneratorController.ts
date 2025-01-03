import container from '../config/container'
import { Request, Response } from 'express'
import GeneratorBaseService from '../services/GeneratorBaseService'

class GeneratorController {
    generatorBaseService: GeneratorBaseService
    constructor() {
        this.generatorBaseService = container.resolve('generatorBaseService')

        this.check = this.check.bind(this)
        this.generate = this.generate.bind(this)
    }

    check(req: Request, res: Response): void {
        try {
            const message = this.generatorBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async generate(req: Request, res: Response): Promise<void> {
        try {
            const {
                generator_model,
                generation_method = 'single_attribute',
                bias_type = 'gender',
                number = 5,
                explanation = false,
                invert_prompts = false,
                attribute = '',
                attribute_1 = '',
                attribute_2 = '',
            }: {
                generator_model: string
                generation_method: string
                bias_type: string
                number: number
                explanation: boolean
                invert_prompts: boolean
                attribute: string
                attribute_1: string
                attribute_2: string
            } = req.body

            const generatedData = await this.generatorBaseService.generate(
                generator_model,
                generation_method,
                bias_type,
                number,
                explanation,
                invert_prompts,
                attribute,
                attribute_1,
                attribute_2
            )
            res.send(generatedData)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default GeneratorController
