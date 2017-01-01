export default function createFormReducer({name, fields, nonFieldProperties, extendReducer}) {
    if(!name) {
        throw new Error('Reducer must have a name')
    }

    const defaultState = {
        ...nonFieldProperties,
        values: {},
        errors: {}
    }

    fields.map((field) => {
        defaultState.values[field.name] = field.default
        if(field.validation) {
            defaultState.errors[field.name] = ''
        }
    })

    return function formReducer(state=defaultState, action) {
        if(action.type === `${name}/UPDATE_FIELD`) {
            const validationFunction = fields.find((field) => field.name === action.payload.field).validate

            return {
                ...state,
                 values: {...state.values, [action.payload.field]: action.payload.value},
                 errors: {...state.errors, [action.payload.field]: validationFunction()}
             }
        }

        if(action.type === `${name}/UPDATE_ERROR`) {
            return {
                ...state,
                errors: {...state.errors, [action.payload.field]: action.payload.value}
            }
        }

        if(action.type === `${name}/RESET`) {
            return updatedDefaultState
        }

        return state
    }
}
