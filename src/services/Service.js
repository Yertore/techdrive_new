import { useRequest } from '../hooks/request.hook';

const Service = () => {
    // eslint-disable-next-line
    const { request } = useRequest();
    const _apiBase = "https://api.open-meteo.com/v1/forecast?";

    const getWeather = async (latitude, longitude, day) => {
        if (latitude && longitude && day) {
            let req = '';
        if (day.value === 7) {
            req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto`;
        } else {
            req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&forecast_days=${day.value}`;
        }
        const weather = await request(req);
        return {weather, req};
        }
    }
    const getWeatherForGivenDay = async (latitude, longitude, date) => {
        const weather = await request(`${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start_date=${date}&end_date=${date}`);
        const req = `${_apiBase}latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto&start_date=${date}&end_date=${date}`;
        return {weather, req};
    }

    return {
        getWeather,
        getWeatherForGivenDay
    }
}

export default Service;