export const propertiesSelectionValidation = (
    length: number,
    itemsAreTupleOfStrings = false
) => {
    const itemSchema = itemsAreTupleOfStrings
        ? {
              type: 'array',
              items: [{ type: 'string' }, { type: 'string' }],
              minItems: 2,
              maxItems: 2,
          }
        : { type: 'string' }

    return {
        type: 'array',
        items: itemSchema,
        minItems: length,
        maxItems: length,
    }
}
