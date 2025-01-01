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

    check(req: Request, res: Response): void {
        try {
            const message = this.modelBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    indexGeneratorModels(req: Request, res: Response): void {
        try {
            const judgeModels: string[] =
                this.modelBaseService.indexGeneratorModels()
            res.json(judgeModels)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    addGeneratorModel(req: Request, res: Response): void {
        try {
            const {
                id,
                category = 'ollama',
            }: { id: string; category: string } = req.body
            const model = this.modelBaseService.addGeneratorModel(id, category)
            res.json(model)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    removeGeneratorModel(req: Request, res: Response): void {
        try {
            const { id } = req.params
            const result: boolean =
                this.modelBaseService.removeGeneratorModel(id)
            const message: string = result
                ? 'Successfully removed.'
                : 'Could not remove model.'
            res.send({ message })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ModelController
