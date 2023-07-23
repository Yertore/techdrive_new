import { useState, useMemo, useContext } from 'react';
import Service from '../services/Service';
import utils from '../helper/utils';
import ExportExcel from './ExportExcel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MyContext } from "../context";

const Table = ({ latitude, longitude }) => {

    const { log, setLog, selectedCity } = useContext(MyContext);

    const [date, setDate] = useState(null);
    const { getWeatherForGivenDay } = Service();
    const { getZero, formatDate } = utils();

    const filteredData = useMemo(() =>
        date ? log.filter(item => item.date === formatDate(date)) : log, 
        // eslint-disable-next-line
    [date]);

    //Call sevice to selected day
    const onRequestGivenDay = () => {
        if(!selectedCity) {
            alert("please select city")
        } else {            
            getWeatherForGivenDay(latitude, longitude, `${date.getFullYear()}-${getZero(date.getMonth()+ 1)}-${getZero(date.getDate())}`)
                .then(onWeatherGivenDayLoaded)
        }
    }

    const onWeatherGivenDayLoaded = async({weather, req}) => {
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

    return (
        <>
            <div>
                <label style={{margin: "10px"}} htmlFor="name">Filter by Date:</label> 
                <DatePicker className='datepicker' isClearable showIcon dateFormat="yyyy-MM-dd" selected={date} onChange={(date) => setDate(date)} />
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