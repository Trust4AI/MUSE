import container from '../containers/container'
import { Request, Response } from 'express'

class MetamorphicTestingController {
    metamorphicTestingService: any
    constructor() {
        this.metamorphicTestingService = container.resolve(
            'metamorphicTestingService'
        )

        this.check = this.check.bind(this)
        this.generate = this.generate.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.metamorphicTestingService.check()
            res.json(message)
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }

    async generate(req: Request, res: Response) {
        try {
            const { role, type, number = 5, explanation = false } = req.body
            const generatedData = await this.metamorphicTestingService.generate(
                role,
                type,
                number,
                explanation
            )
            res.send(generatedData)
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }
}

export default MetamorphicTestingController
