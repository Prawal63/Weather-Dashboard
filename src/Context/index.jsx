import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('Hyderabad')
    const [thisLocation, setLocation] = useState('')
//Fetching  api here
        const fetchWeather = async () => {
            const options = {
                method: 'GET',
                url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
                params: {
                    aggregateHours: '24',
                    location: place,
                    contentType: 'json',
                    unitGroup: 'metric',
                    shortColumnNames: 0,
                },
                headers: {
                    'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                    'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
                }
        }
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
            
            const locations = response.data.locations;
    
            if (locations && Object.keys(locations).length > 0) {
                const thisData = Object.values(locations)[0];
                setLocation(thisData.address);
                setValues(thisData.values);
                setWeather(thisData.values[0]);
            } else {
                alert('Data format is not as expected');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred while fetching weather data'+e.message);
        }
    }

    useEffect(() => {
        if(place){
        fetchWeather()
        }
    }, [place])

    useEffect(() => {
        console.log(values)
    }, [values])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
           
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)