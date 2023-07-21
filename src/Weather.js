import React from 'react';
import './styles/style.css';

import {datas as requestData } from  './db/data';
import { useState, useMemo } from 'react';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {cities} from './db/cities';
import Select from 'react-select';

function Weather() {
  const [data, setData] = useState(requestData);
  const [startDate, setStartDate] = useState(new Date());
  const [city, setCity] = useState("Almaty");
  const [coordinates, setCordinates] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const fileName = "myfile";

  function getZero(num) {
    if (num >= 0 && num < 10){
        return `0${num}`;
    } else {
        return num;
    }
  };

  const getCityPoint = async () => {
    let apiKey = "1pfFmMtiUKWYo+drdaoZkg==ijG7JvPlZcQdHshD";
    let url = 'https://api.api-ninjas.com/v1/geocoding?city=' + selectedCity;
    const response = await fetch(url,
    {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        "Content-Type": "application/json",
      }
    });
    const coordinates = await response.json();
    setCordinates(coordinates[0]);
  }
  
  const filteredData = useMemo(() =>
    startDate ? data.filter(item => item.date === `${startDate.getFullYear()}-${getZero(startDate.getMonth()+ 1)}-${startDate.getDate()}`) : data, 
    // eslint-disable-next-line  
  [startDate]);


  const  getWeatherForSevenDays = async () => {
    if(!selectedCity) {
      alert("please select city")
    } else {
      const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=43.2775&longitude=76.8958&hourly=temperature_2m");
      const weather = await response.json();
      setData([...data, {
        id: data[data.length-1].id + 1,
        request: "req",
        response: JSON.stringify(weather),
        date: weather.hourly.time[0].substr(0, 10),
        city: selectedCity?.value
      }]);
    }
  }

  const  getWeatherForOneDay = async () => {
    if(!selectedCity) {
      alert("please select city")
    } else {
      //getCityPoint();
      let latitude = cities.find(el => el.city === selectedCity?.value)?.lat;
      let longitude = cities.find(el => el.city === selectedCity?.value)?.lng;
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`);
      const weather = await response.json();
      setData([...data, {
        id: data[data.length-1].id + 1,
        request: "req",
        response: JSON.stringify(weather),
        date: weather.hourly.time[0].substr(0, 10),
        city: selectedCity?.value
      }]);
    }
  }

  const ExportExcel = ({ excelData, fileName }) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
  
    const exportToExcel = async () => {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    };
    return (
      <button 
        onClick={(e) => exportToExcel(fileName)}
        className="btn_export">
        Export to Excel
      </button>
    );
  };

  const kzCitiesList = [];
  cities.map(item => kzCitiesList.push(Object.assign({}, {value: item.city, label: item.city})));

  return (
    <div>
      <h1>Weather</h1>
      <div>
        <label htmlFor="name">City:</label>
        <input value={city} onChange={setCity} type="text" id="name" name="name" required
        minLength="1" maxLength="30" size="30"></input>
        <button className='btn' onClick={getCityPoint}>Search</button>
      </div>
      <div>
        <Select
        className='select'
          value={selectedCity}
          defaultValue={selectedCity}
          onChange={setSelectedCity}
          options={kzCitiesList}
        />
      </div>
      <button className='btn green' onClick={getWeatherForSevenDays}>Week</button>
      <button className='btn' onClick={getWeatherForOneDay}>Day</button>
      
      <div style={{margin: "10px 0"}}>
      <label htmlFor="name">Filter by Date:</label> <DatePicker className='datepicker' showIcon dateFormat="yyyy-MM-dd" selected={startDate} onChange={(date) => setStartDate(date)} />
        <ExportExcel excelData={filteredData} fileName={fileName} />
      </div>
      
      <table id="tblData">
            <tbody>
                <tr>
                    <th>Request</th>
                    <th>Response</th>
                    <th>Date</th>
                    <th>City</th>
                </tr>
                {filteredData.length ? filteredData.map(item => (
                        <tr key={item.id}>
                            <td>{item.request}</td>
                            <td>{item.response}</td>
                            <td>{item.date}</td>
                            <td>{item.city}</td>
                        </tr>
                    )) : 
                    <p>There are no datas</p>
                }
            </tbody>
      </table>
    </div>
  );
}

export default Weather;

