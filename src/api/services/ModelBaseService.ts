import {
    getGeneratorModels,
    getGeneratorModelsList,
    addGeneratorModel,
    removeGeneratorModel,
} from '../utils/modelUtils'

class ModelBaseService {
    check() {
        return { message: 'The model routes are working properly!' }
    }

    exists(id: string): boolean {
        const generatorModels: string[] = getGeneratorModelsList()
        return generatorModels.includes(id)
    }

    indexGeneratorModels(): string[] {
        return getGeneratorModels()
    }

    addGeneratorModel(
        id: string,
        category: string
    ): { id: string; category?: string } {
        addGeneratorModel(id, category)
        const res: { id: string; category?: string } = { id }
        if (category) {
            res.category = category
        }
        return res
    }

    removeGeneratorModel(id: string): boolean {
        const removed = removeGeneratorModel(id)
        return removed
    }
}

export default ModelBaseService
