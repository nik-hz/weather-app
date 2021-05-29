# React Redux weather app

This project is made using React js and Redux for state management.

Use this as a simple guide to using redux in your projects (I am by no means very proficient in Redux, so treat this as a guide for beginners by beginners)

heres a link to the site deployed on github pages https://nik-hz.github.io/weather-app/ styling was not the purpose of this lol, but it looks decent on mobile format...

check out my blog (it's new so it looks a bit meh) for more content [https://fullstackdoge.wordpress.com/]

## Description

the app fetches user location, using geolocation and then calls the openweather API to fetch current weather at the users location. My personal API key is not included (the API is free for 60 calls per minute so just go make your own) 

Main point of this project is as a practice for Redux, and a simple guide for those who don't really understand it yet. (more on Redux below)

## Installation

Do the normal git clone to use this project, everything is included (except the API key). If you do decide to use this project make your own API key [https://openweathermap.org/api] --> sign up with any email its free

you will need to make a .env file with a variable REACT_APP_WEATHER_TOKEN=**your key here** and then it will work normally 

**DON'T FORGET TO ADD .ENV TO YOUR GITIGNORE --> NEVER UPLOAD API KEYS ANYWHERE** 

**NEVER UPLOAD ANY SECRET KEYS ANYWHERE OR GIVE THEM TO ANYONE**


## REDUX!!!

Now onto the good part (hope this helps lol, a pain to write) --> If you are good with Redux, then skip this part completely :)

If your'e still reading then I asusme you don't know how to use redux yet (or suck at it as much as I do) so heres how I figured it out. 

Basically your react app uses *state* to pass data around. Redux is like a toolkit that lets you build an external harddrive (in relative terms to your app) and read and write data from it. The catch is that you have to do all the setup manually and wire it to you app which can be a bit daunting. 

## Redux - first step

The first thing you need to do with redux is set up your store

````javascript
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import App from './components/App'
import rootReducers from './reducers'

const store = createStore(
    rootReducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f
    )
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
)
````
 in the first step you pass store to the Provider tag, which is just boilerplate, no need to think too muich about this at this point.
 
 the createStore takes rootReducers (no this does not need to be called this way, but you will usually see this called rootReducers --> it is simply all your reducers bundled together, more on this later)
 
 
## Actions

Actions are what makes Redux special. I like to think of them as the equivalent of taking your logic out of your react components and putting them in separate functions (only this time with some extra steps)

in analogy terms, actions are like the cable connecting your harddrive (redux) to your app. 

It is important that you use redux-thunk for this, since it lets you use middleware in your action creators which is Really useful. In the first section, I've wired up redux thunk, so if you followed my boilerplate you should be ok. Thunk lets us use the middeware **dispatch** and **getState** which is really helpful.

Also as a sidenote don't get scared by the way that the two arrow functions are written. It is the same as a function returning a function.

#### Dispatch and getState

Dispatch and getState are premade middleware that are really useful for using redux. Dispatch is necessarym because it is like the bridge between our app and the harddrive. think of calling dispatch like copying stuff into the harddrive. Dispatch sends its payload (with a type **the tyoe can be a string, but you really should have a file called types, where you export strings as variables for simplicty sake** to your reducers who then do magic)

getState is like using file explorer to browse your harddrive in an action creator, it lets you access the state in the action creators and work with that.

heres an example from my code where I use getState in the second action, to access the state, fetch the user data and fetch the weather from the API. 

````javascript
const { city, countryCode, countryName } = getState().location.data
        const weather = await axios.get(
````
Some people say you should access state from your actions, some say you shouldn't. I'm not at the point where I can have an opinion on this so I just do whatever works. 

### Making your action creator

Now we will go on to make our action creator (there are special steps to using this inside your react component, but more to that later on)

If you look inside of the actions folder in this repo, you will see that they look a lot like normal functions, expcept for some small details. The logic is pretty evident so I won't explain it again.

````javascript
export const fetchLocation = (city, country) => async (dispatch, getState) => {

// Code goes here to do whatever logic you want to run with it

    dispatch({ type: INITIAL_COORD_LOCATION, payload: position })
}
````
in the above example taken from index.js, actions the main parts of an action creator are shown. Basically this action creator only dispatches whatever the logic returns. with a type of INITIAL_COORD_LOCATION and a payload of what our code returns, in this case the users location.

Action creators send their payload to the reducers which then take the payload and upload the state to your choosing.

## Reducers

Reducers are the second thing that Redux is all about. Think of them like robots inside of your harddrive that process data which is sent to them by so called action creators. In the reducers folder you will find the two reducers that are used for this app. (they both get bundled into the harddrive in the previous step. 

#### Step one make your Reducers

Your reducer will take whatever the action sends it, the type will specify what the reducer should do through a switch. 

````javascript
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

````

in this case the reducer will overwrite the location (in the state) with the new location every time. you could be fancy and use a spread to keep parts of the old state, but in this case since its the location data, we need to renew it evry time. 

What the reducer does it judge what its getting and then modifying the state accordingly. You can think of it like a filter to your harddrive. Or even better an automated sorting algorith that you can configure to save data in certain locations on your harddrive. 

You will need to combine your reducers in index,reducers before sending it off to be made into the store (remeber the first boilerplate I showed you)

````javascript
import { combineReducers } from 'redux'

import { locationReducer } from './locationReducer'
import { weatherReducer } from './weatherReducer'

export default combineReducers({
    location: locationReducer,
    weather: weatherReducer,
})
````
Notice that I import the two reducers, run them through combine and then export them.

### CONNECTING ALL THIS TO THE ACTUAL REACT APP

Now that we've gone through all the setup here's how you use redux with your react app. 

At the bottom of your app you will see this

````javascript
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
````
connect is a boilerplate function that is like the USB port on your computer where your harddrive plugs in. 

![Alt Text](https://i.imgur.com/8eKLSMk.gif)

the first thing we pass into it in this case is a function called mapStateToProps, which makes the state (data on your redux store / harddrive) usable as props (remember props are what your react components use). the second thing I pass through is an object with my actions. This makes my actions usable in the component like normal functions which I can invoke. Finally we connect (the function is called connect for a reason) to our component, which I call App. 

#### Actually calling action creators in your components!

````javascript
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
````
I call my actions from the useEffect hook and a custom submit handler. 

The useEffect hook runs once on render [https://reactjs.org/docs/hooks-effect.html] and calls my fetchLocation action which does what you think it does.

my submit handler calls the second action with the data that the user passed into the form, to find weather from any place on Earth :O

# And there you have it :) 
I hope this helps someone who's as lost as I was when I started with Redux. 

