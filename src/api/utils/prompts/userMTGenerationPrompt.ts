import { UserMTGenerationPromptParams } from '../../types'

const userMTGenerationPrompt = ({
    role,
    biasType,
    number,
    explanation,
}: UserMTGenerationPromptParams) => {
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

export { userMTGenerationPrompt }
