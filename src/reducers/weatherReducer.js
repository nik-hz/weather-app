import { FETCH_WEATHER } from '../types.js'

export const weatherReducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_WEATHER:
            return [action.payload]
        default:
            return state
    }
}
