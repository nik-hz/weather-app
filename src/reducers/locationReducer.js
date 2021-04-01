import { FETCH_LOCATION } from '../types.js'

export const locationReducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_LOCATION:
            // console.log(action.payload)
            return action.payload
        default:
            return state
    }
}
