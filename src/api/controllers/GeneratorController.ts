import container from '../config/container'
import { Request, Response } from 'express'

class GeneratorController {
    generatorBaseService: any
    constructor() {
        this.generatorBaseService = container.resolve('generatorBaseService')

        this.check = this.check.bind(this)
        this.generate = this.generate.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.generatorBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async generate(req: Request, res: Response) {
        try {
            const {
                generator_model,
                generation_method = 'single_attribute',
                role,
                bias_type,
                number = 5,
                explanation = false,
                invert_prompts = false,
            } = req.body
            const generatedData = await this.generatorBaseService.generate(
                generator_model,
                generation_method,
                role,
                bias_type,
                number,
                explanation,
                invert_prompts
            )
            res.send(generatedData)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default GeneratorController
