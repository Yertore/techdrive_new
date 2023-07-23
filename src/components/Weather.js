import React from 'react';
import { useState } from 'react';
import '../styles/style.css';
import Service from '../services/Service';
import {logs as requestData } from  '../db/logs';
import {kzcities} from '../db/kzcities';
import Select from 'react-select';
import Table from './Table';
import { MyContext } from "../context";

function Weather() {
    //call service
    const {getWeatherForSevenDays, getWeatherForOneDay } = Service();
  
    const [log, setLog] = useState(requestData);
    const [selectedCity, setSelectedCity] = useState(null);

    //Array kz cities
    const kzCitiesList = [];
    kzcities.map(item => kzCitiesList.push(Object.assign({}, {value: item.city, label: item.city})));

    let latitude = kzcities.find(el => el.city === selectedCity?.value)?.lat;
    let longitude = kzcities.find(el => el.city === selectedCity?.value)?.lng;

    //Call sevice to 1 day
    const onRequestOneDay = () => {
        if(!selectedCity) {
            alert("please select city")
        } else {            
            getWeatherForOneDay(latitude, longitude)
                .then(onWeatherOneDayLoaded)
        }
    }

    const onWeatherOneDayLoaded = async({weather, req}) => {
        //berem temperaturu max min za 1 den
        let tempTempArr = [...weather.hourly.temperature_2m];
        let maxTemp = Math.max(...tempTempArr);
        let minTemp = Math.min(...tempTempArr);

        setLog([...log, {
            id: !log.length ? 1 : log[log.length-1].id + 1,
            request: req,
            response: JSON.stringify(weather),
            date: weather.hourly.time[0].substr(0, 10),
            temperature: `Min: ${minTemp}, Max: ${maxTemp}`,
            city: selectedCity?.value
        }]);
    }

    //Call sevice to 7 days
    const onRequestSevenDays = () => {
        if(!selectedCity) {
            alert("please select city")
        } else {
            getWeatherForSevenDays(latitude, longitude)
                .then(onWeatherSevenDaysLoaded)
        }
    }

    const onWeatherSevenDaysLoaded = async({weather, req}) => {
        //vytawil unikalnye daty
        let tempDateArr = []
        weather.hourly.time.map(item => tempDateArr.push(item.substr(0, 10)));
        let unique = Array.from(new Set(tempDateArr));

        //berem temperatury min max za kajdyi den
        let tempTempArr = [...weather.hourly.temperature_2m];
        let temp = [];
        let index = 0;
        let length = 24;
        for (let i = 0; i < 7; i++) {
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
                city: selectedCity?.value
            })
        }
        //ob`edin9iu massivy
        setLog([...log, ...arr]);
    }

    return (
        <>
            <h1>Weather</h1>
            <Select
                className='select'
                value={selectedCity}
                defaultValue={selectedCity}
                onChange={setSelectedCity}
                options={kzCitiesList}
            />

            <button className='btn' onClick={onRequestSevenDays}>Week</button>
            <button className='btn' onClick={onRequestOneDay}>Day</button>
            <MyContext.Provider value={{ log, setLog, selectedCity }}>
                <Table latitude={latitude} longitude={longitude} />
            </MyContext.Provider>
        </>
    );
}

export default Weather;

