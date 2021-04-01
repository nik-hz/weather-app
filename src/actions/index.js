import axios from 'axios'
import { FETCH_LOCATION, FETCH_WEATHER } from '../types'

// get location and set state --> this should run on render
export const fetchLocation = () => async (dispatch, getState) => {
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
    dispatch({ type: FETCH_LOCATION, payload: position })
}

// make this calle-able with city name and lat+long coords
export const fetchWeather = () => async (dispatch, getState) => {
    // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
    try {
        const { city, latitude, longitude } = getState().location.data
        const weather = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    q: city,
                    // lat: latitude,
                    // lon: longitude,
                    // metric changes the units from K to C
                    units: 'metric',
                    // its a free api with 60 calls per minute so here you go, use the key responsibly pls
                    appid: '386bccd20d1ba060a2c3c46179352d7b',
                },
            }
        )

        dispatch({ type: FETCH_WEATHER, payload: weather })
    } catch (error) {
        console.error(error)
    }

    // const weather = await axios.get()
}
