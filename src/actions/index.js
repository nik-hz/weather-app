import axios from 'axios'
import {
    INITIAL_COORD_LOCATION,
    FETCH_LOCATION,
    SET_LOCATION,
    FETCH_WEATHER,
} from '../types'

export const fetchLocation = (city, country) => async (dispatch, getState) => {
    const coords = async () => {
        await navigator.geolocation.getCurrentPosition((pos) => {
            // console.log('from action pos:', pos)

            return {
                longitude: pos.coords.latitude,
                latitude: pos.coords.longitude,
            }
        })
    }

    const position = await axios.get(
        'https://api.bigdatacloud.net/data/reverse-geocode-client',
        // ?latitude=37.42159&longitude=-122.0837&localityLanguage=de'
        {
            params: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                localityLanguage: 'en',
            },
        }
    )
    // location is an object with lat and longitude
    dispatch({ type: INITIAL_COORD_LOCATION, payload: position })
}

// get location from the text input -> this updates the same location state
// for this we will use the location setting from the weather API
// basically getweather will dispatch two actions --> we will run both reducers
// fetch weather and u[date location in the same time

export const fetchWeatherAndCity = (formCity, formCountry) => async (
    dispatch,
    getState
) => {
    // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
    try {
        const { city, countryCode, countryName } = getState().location.data
        const weather = await axios.get(
            // 'https://api.openweathermap.org/data/2.5/onecall',
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    // city + country code separated by comma
                    // should need some custom error handling with circling back to find city without country code
                    // plus error msg --> fun project idea
                    q: `${formCity ? formCity : city},${
                        formCountry ? formCountry : countryName
                    }`,
                    // lat: latitude,
                    // lon: longitude,
                    // metric changes the units from K to C
                    units: 'metric',
                    // its a free api with 60 calls per minute so here you go, use the key responsibly pls
                    appid: '386bccd20d1ba060a2c3c46179352d7b',
                },
            }
        )

        console.log(weather)
        // pluck out the coords from the weather API and call the fetchCoords action

        const position = await axios.get(
            'https://api.bigdatacloud.net/data/reverse-geocode-client',
            // ?latitude=37.42159&longitude=-122.0837&localityLanguage=de'
            {
                params: {
                    latitude: weather.data.coord.lat,
                    longitude: weather.data.coord.lon,
                    localityLanguage: 'en',
                },
            }
        )
        // location is an object with lat and longitude
        dispatch({ type: FETCH_LOCATION, payload: position })

        dispatch(
            { type: FETCH_WEATHER, payload: weather }
            // { type: FETCH_LOCATION, payload: weather }
        )
    } catch (error) {
        console.error(error)
    }

    // const weather = await axios.get()
}
