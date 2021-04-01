import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchLocation, fetchWeather } from '../actions'

const Weather = ({ fetchLocation, fetchWeather, location, weather }) => {
    // run on every re-render --> fetchLocation will only run if there is no location at all
    useEffect(() => {
        fetchLocation()
        console.log('fetchLocation ran in Weather useEffect hook')
        return () => {}
    }, [])

    useEffect(() => {
        fetchWeather()
        return () => {}
    }, [])

    const onClick = (e) => {
        e.preventDefault()
        fetchWeather()
    }

    return (
        <div>
            DEMO WEATHER APP
            {/* names are a bit screwed up but well keep location as is with long and lat comp. */}
            <div>
                location: {location.data ? location.data.city : 'loading'}
            </div>
            <button onClick={(e) => onClick(e)}>
                Your location is:
                {location.data ? location.data.latitude : 'loading'}
                {location.data ? location.data.longitude : 'loading'}
            </button>
        </div>
    )
}

Weather.propTypes = {}

const mapStateToProps = (state) => {
    return {
        // notice these are in files named ...Reducer, but the name is changed in index.js reducers
        location: state.location,
        weather: state.weather,
    }
}

// fetchLocation is basically my custom dispatch action that is in /actions
export default connect(mapStateToProps, { fetchLocation, fetchWeather })(
    Weather
)
