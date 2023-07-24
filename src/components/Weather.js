import React from 'react';
import { useState, useEffect, } from 'react';
import '../styles/style.css';
import Service from '../services/Service';
import {logs as requestData } from  '../db/logs';
import {kzcities} from '../db/kzcities';
import Select from 'react-select';
import Table from './Table';
import { MyContext } from "../context";
import TextField from '@mui/material/TextField';

function Weather() {
    //call service
    const { getWeather } = Service();
    const [log, setLog] = useState(requestData);
    const [cityInput, setCityInput] = useState("");
    const [coordinates, setCordinates] = useState({});


    //Array kz cities
    const kzCitiesList = [];
    kzcities.map(item => kzCitiesList.push(Object.assign({}, {value: item.city, label: item.city})));
    const daysList = [
        {value: 1, label: "1 day"},
        {value: 3, label: "3 days"},
        {value: 7, label: "7 days"},
        {value: 14, label: "14 days"},
        {value: 16, label: "16 days"},
    ];
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDay, setSelectedDay] = useState(daysList[0]);

    let latitude = !cityInput ? kzcities.find(el => el.city === selectedCity?.value)?.lat : (coordinates?.latitude ? coordinates?.latitude : null);
    let longitude = !cityInput ? kzcities.find(el => el.city === selectedCity?.value)?.lng : (coordinates?.longitude ? coordinates?.longitude : null);

    const getCityCoordinates = async () => {
        let apiKey = "1pfFmMtiUKWYo+drdaoZkg==ijG7JvPlZcQdHshD";
        let url = 'https://api.api-ninjas.com/v1/geocoding?city=' + cityInput;
        //request
        if(cityInput) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': apiKey,
                        "Content-Type": "application/json",
                    }
                })
                const ans = await response.json();
                setCordinates(ans[0]);
            } catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        getCityCoordinates();
        // eslint-disable-next-line
    }, [cityInput]);

    //Call sevice to 7 days
    const onRequest = () => {
        if (!selectedCity && !cityInput) {
            alert("please select city")
        } else {
            if (latitude && longitude){
            getWeather(latitude, longitude, selectedDay)
                .then(onWeatherLoaded)
            } else {alert("Incorrect city")}
        }
    }

    const onWeatherLoaded = async({weather, req}) => {
        let city = coordinates?.name ? coordinates?.name : selectedCity?.value;
        //vytawil unikalnye daty
        let tempDateArr = []
        weather.hourly.time.map(item => tempDateArr.push(item.substr(0, 10)));
        let unique = Array.from(new Set(tempDateArr));

        //berem temperatury min max za kajdyi den
        let tempTempArr = [...weather.hourly.temperature_2m];
        let temp = [];
        let index = 0;
        let length = 24;
        for (let i = 0; i < selectedDay.value; i++) {
            temp[i] = [Math.min(...tempTempArr.slice(index, length)), Math.max(...tempTempArr.slice(index, length))];
            index = index + 24;
            length = length + 24;
        }
        temp.filter(item => [Math.min(...item), Math.max(...item)])
        
        //vremenno xraniu dannye v drugom massive
        let arr = []
        let counter = !log.length ? 0 : log[log.length-1].id; //dl9 id

        for (let i = 0; i < unique.length; i++) {
            arr.push({
                id: ++counter,
                request: req,
                response: JSON.stringify(weather),
                date: unique[i],
                temperature: `Min: ${temp[i][0]}, Max: ${temp[i][1]}`,
                city: city
            })
        }
        //ob`edin9iu massivy
        setLog([...log, ...arr]);
    }

    return (
        <>
            <div>
                <label style={{margin: "10px"}} htmlFor="name">Select the city:</label>
                <Select
                    className='selectcity'
                    value={selectedCity}
                    defaultValue={selectedCity}
                    onChange={setSelectedCity}
                    options={kzCitiesList}
                />
                <label style={{margin: "10px"}} htmlFor="name"> or type the city(*priority): </label>
                <TextField value={cityInput} onChange={e => setCityInput(e.target.value)} id="outlined-basic" label="City" variant="outlined" />
                <label style={{margin: "5px 10px"}} htmlFor="name">Select day(s):</label>
                <Select
                    className='selectday'
                    value={selectedDay}
                    defaultValue={selectedDay}
                    onChange={setSelectedDay}
                    options={daysList}
                />
                <button className='btn' onClick={onRequest}>Request</button>
            </div>
            <MyContext.Provider value={{ log, setLog, selectedCity, cityInput }}>
                <Table latitude={latitude} longitude={longitude} />
            </MyContext.Provider>
        </>
    );
}

export default Weather;

