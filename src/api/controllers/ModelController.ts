import container from '../config/container'
import { Request, Response } from 'express'

class ModelController {
    modelBaseService: any
    constructor() {
        this.modelBaseService = container.resolve('modelBaseService')

        this.check = this.check.bind(this)
        this.indexGeneratorModels = this.indexGeneratorModels.bind(this)
        this.addGeneratorModel = this.addGeneratorModel.bind(this)
        this.removeGeneratorModel = this.removeGeneratorModel.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.modelBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async indexGeneratorModels(req: Request, res: Response) {
        try {
            const judgeModels =
                await this.modelBaseService.indexGeneratorModels()
            res.json(judgeModels)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async addGeneratorModel(req: Request, res: Response) {
        try {
            const { id, category = 'ollama' } = req.body
            const model = await this.modelBaseService.addGeneratorModel(
                id,
                category
            )
            res.json(model)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async removeGeneratorModel(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await this.modelBaseService.removeGeneratorModel(id)
            const message = result
                ? 'Successfully removed.'
                : 'Could not remove model.'
            res.send({ message })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ModelController
