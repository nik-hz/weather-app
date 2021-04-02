import { INITIAL_COORD_LOCATION, FETCH_LOCATION } from '../types.js'

export const locationReducer = (state = [], action) => {
    switch (action.type) {
        case INITIAL_COORD_LOCATION:
            return action.payload
        case FETCH_LOCATION:
            // update the entire coords object
            console.log(action.payload)
            return action.payload
        // console.log(action.payload)

        default:
            return state
    }
}
