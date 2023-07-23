//import { useState } from 'react';
//import {logs as requestData } from  '../db/logs';
import { useRequest } from '../hooks/request.hook';

const Service = () => {
    // eslint-disable-next-line
    const { request } = useRequest();

    const _apiBase = "https://api.open-meteo.com/v1/forecast?";
    //const [data, setData] = useState(requestData);

    const  getWeatherForSevenDays = async (latitude, longitude) => {
        const weather = await request(`${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto`);
        const req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto`;
        return {weather, req};
    }

    const getWeatherForOneDay = async (latitude, longitude) => {
        const weather = await request(`${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=1`);
        const req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=1`;
        return {weather, req};
    }
    const getWeatherForGivenDay = async (latitude, longitude, date) => {
        const weather = await request(`${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start_date=${date}&end_date=${date}`);
        const req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start_date=${date}&end_date=${date}`;
        return {weather, req};
    }

    return {
        getWeatherForSevenDays,
        getWeatherForOneDay,
        getWeatherForGivenDay

    }
}

export default Service;