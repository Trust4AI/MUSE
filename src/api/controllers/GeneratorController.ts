import container from '../config/container'
import { Request, Response } from 'express'
import GeneratorBaseService from '../services/GeneratorBaseService'
import { GenerateRequestDTO } from '../utils/objects/GenerateRequestDTO'

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
            const dto: GenerateRequestDTO = new GenerateRequestDTO(req.body)

            const generatedData = await this.generatorBaseService.generate(dto)
            res.send(generatedData)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default GeneratorController
