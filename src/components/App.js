import React, { useEffect } from 'react'

import Weather from './Weather'
import { fetchLocation, fetchWeather } from '../actions'

export const App = () => {
    // useEffect(() => {
    //     fetchLocation()
    //     console.log('fetchLocation ran in Weather useEffect hook')
    //     return () => {}
    // }, [])

    // useEffect(() => {
    //     fetchWeather()
    //     return () => {}
    // }, [])

    return (
        <div>
            <Weather></Weather>
        </div>
    )
}
