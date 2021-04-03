import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchLocation, fetchWeatherAndCity } from '../actions'

// styiling related imports
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

// Importing MUI icons for the weather view
import FilterDramaIcon from '@material-ui/icons/FilterDrama'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import FormatColorResetIcon from '@material-ui/icons/FormatColorReset'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import { Filter } from '@material-ui/icons'
import GrainIcon from '@material-ui/icons/Grain'
const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 5,
        justifyContent: 'center',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },

    input: {},
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    cardAction: {
        justifyContent: 'center',
    },
    button: {
        margin: theme.spacing(1),
    },
}))

const App = ({ fetchLocation, fetchWeatherAndCity, location, weather }) => {
    const classes = useStyles()
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

    const onSubmit = (e) => {
        console.log(e)
        e.preventDefault()
        console.log(formData)

        fetchWeatherAndCity(formData.city, formData.country)
    }

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    //     import FilterDramaIcon from '@material-ui/icons/FilterDrama'
    // import WbSunnyIcon from '@material-ui/icons/WbSunny'
    // import FormatColorResetIcon from '@material-ui/icons/FormatColorReset'
    // import AcUnitIcon from '@material-ui/icons/AcUnit'

    const iconPicker = (weather) => {
        //{/* Clear, Clouds Rain, Snow */}
        switch (weather) {
            case 'Clear':
                return <WbSunnyIcon />
            case 'Clouds':
                return <FilterDramaIcon />
            case 'Rain':
                return <FormatColorResetIcon />
            case 'Snow':
                return <AcUnitIcon />
            case 'Mist':
                return <GrainIcon />
            default:
                return 'loading'
        }
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5">Demo Weather App</Typography>
                </CardContent>
            </Card>
            <Card className={classes.root}>
                <CardContent>
                    {/* names are a bit screwed up but well keep location as is with long and lat comp. */}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className={classes.root}>
                            <TextField
                                id="standard-full-width"
                                label="City"
                                // style={{ margin: 8 }}
                                helperText="Enter the full name"
                                fullWidth
                                margin={'normal'}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="text"
                                placeholder={
                                    location.data ? location.data.city : 'City'
                                }
                                // value={location.data ? location.data.city : 'loading'}
                                name="city"
                                onChange={(e) => onChange(e)}
                            />
                            <TextField
                                id="standard-full-width"
                                label="Country"
                                // style={{ margin: 8 }}
                                helperText="Enter the full name"
                                fullWidth
                                margin={'normal'}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                type="text"
                                placeholder={
                                    location.data
                                        ? location.data.countryName
                                        : 'Country'
                                }
                                name="country"
                                onChange={(e) => onChange(e)}
                            />
                        </div>

                        <CardActions className={classes.cardAction}>
                            <Button
                                variant="contained"
                                className={classes.button}
                                type="submit"
                            >
                                Weather Forecast
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
            <Card className={classes.root}>
                <CardContent className={classes.cardAction}>
                    <Typography variant="h6">Weather</Typography>
                    <Typography variant="subtitle1">
                        {weather.data
                            ? iconPicker(weather.data.weather[0].main)
                            : 'Loading'}
                        <br />
                        {weather.data
                            ? weather.data.weather[0].description
                            : 'Loading'}
                        <br />
                        {weather.data ? weather.data.main.temp : 'Loading'}{' '}
                        degrees celsius
                    </Typography>
                </CardContent>{' '}
            </Card>
        </div>
    )
}

App.propTypes = {}

const mapStateToProps = (state) => {
    return {
        // notice these are in files named ...Reducer, but the name is changed in index.js reducers
        location: state.location,
        weather: state.weather,
    }
}

// fetchLocation is basically my custom dispatch action that is in /actions
export default connect(mapStateToProps, { fetchLocation, fetchWeatherAndCity })(
    App
)
