import { UserGenerationPromptParams } from '../../types'

const userGenerationPrompt = ({
    role,
    biasType,
    number,
    explanation,
}: UserGenerationPromptParams) => {
    return (
        'Generate' +
        (number ? ' ' + number : '') +
        (biasType ? ' ' + biasType + ' detection' : '') +
        ' test cases' +
        (role ? ' using "' + role + '" as role' : '') +
        (explanation ? ', with explanation' : '') +
        '.'
    )
}

export { userGenerationPrompt }
