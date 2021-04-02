import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { fetchLocation, fetchWeatherAndCity } from '../actions'

const Weather = ({ fetchLocation, fetchWeatherAndCity, location, weather }) => {
    // Hooks
    //  custom state hooks, to manage the form inputs --> doing this over redux is too extra
    const [formData, setFormData] = useState({
        city: '',
        country: '',
    })
    // run on every re-render --> fetchLocation will only run if there is no location at all
    useEffect(() => {
        fetchLocation()
        console.log('fetchLocation ran in Weather useEffect hook')

        return () => {}
    }, [])

    // the thought behind this is to fumble around with the states and pass it from redux to local
    // then back to redux
    // very convoluted
    // might fix later
    // current way, uses the redux state to change the placeholder to the current location

    // useEffect(() => {
    //     fetchWeatherAndCity()
    //     return () => {}
    // }, [])

    // const setInputText = async () => {
    //     const res = await location.data
    //     console.log(res)
    //     setFormData({
    //         city: res.city,
    //         country: res.countryName,
    //     })
    // }

    // useEffect(() => {
    //     setInputText()
    // }, [])

    const onSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        console.log(formData)

        fetchWeatherAndCity(formData.city, formData.country)
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div>
            DEMO WEATHER APP
            {/* names are a bit screwed up but well keep location as is with long and lat comp. */}
            <form onSubmit={(e) => onSubmit(e)}>
                <TextField
                    type="text"
                    placeholder={location.data ? location.data.city : 'City'}
                    // value={location.data ? location.data.city : 'loading'}
                    name="city"
                    onChange={(e) => onChange(e)}
                />
                <TextField
                    type="text"
                    placeholder={
                        location.data ? location.data.countryName : 'Country'
                    }
                    name="country"
                    onChange={(e) => onChange(e)}
                />
                <input type="submit" />
            </form>
            <div>
                weather: <br />
                {weather.data ? weather.data.weather[0].main : 'Loading'}
                <br />
                {weather.data ? weather.data.weather[0].description : 'Loading'}
                <p></p>
                temp:
                <br />
                {weather.data ? weather.data.main.temp : 'Loading'} degrees
                celsius
            </div>
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
export default connect(mapStateToProps, { fetchLocation, fetchWeatherAndCity })(
    Weather
)
