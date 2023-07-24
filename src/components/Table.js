import { useState, useMemo, useContext } from 'react';
import Service from '../services/Service';
import utils from '../helper/utils';
import ExportExcel from './ExportExcel';
import { MyContext } from "../context";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Table = ({ latitude, longitude }) => {

    const { log, setLog, selectedCity, cityInput } = useContext(MyContext);

    const [date, setDate] = useState(null);
    const { getWeatherForGivenDay } = Service();
    const { formatDate } = utils();

    const filteredData = useMemo(() =>
        date ? log.filter(item => item.date === formatDate(date)) : log, 
        // eslint-disable-next-line
    [log, date]);

    //Call sevice to selected day
    const onRequestGivenDay = () => {
        if(!selectedCity && !cityInput) {
            alert("please select city")
        } else { 
            if (latitude && longitude){
                getWeatherForGivenDay(latitude, longitude, formatDate(date))
                .then(onWeatherGivenDayLoaded)
            } else {alert("Incorrect city")}  
        }
    }

    const onWeatherGivenDayLoaded = async({weather, req}) => {
        let city = cityInput ? cityInput : selectedCity?.value;
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
            city: city
        }]);
    }

    return (
        <>
            <div className='filterform'>
                <label style={{margin: "10px"}} htmlFor="name">Filter by Date:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker format="YYYY-MM-DD" value={date} onChange={(date) => setDate(date)} label="Date"  />
                    </DemoContainer>
                </LocalizationProvider>
                <button 
                    name="sendReq" 
                    disabled = {!filteredData.length && date && selectedCity ? false : true}
                    className='btn' 
                    onClick={onRequestGivenDay}>
                        Send
                </button>
                <ExportExcel excelData={filteredData} fileName="weather_log" />
            </div>
            
            {filteredData.length ? 
            <table id="tblData">
                <tbody>
                    <tr>
                        <th>Request</th>
                        <th>Response</th>
                        <th>Date</th>
                        <th>temperature</th>
                        <th>City</th>
                    </tr>
                    {filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.request}</td>
                            <td>{`${item.response.slice(0, 230)}...`}</td>
                            <td>{item.date}</td>
                            <td>{item.temperature}</td>
                            <td>{item.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p>There are no data</p>}
        </>    
    )
}

export default Table;