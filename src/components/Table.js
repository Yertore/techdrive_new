import { useState, useMemo } from 'react';

import getZero from '../helper/getZero';
import ExportExcel from './ExportExcel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({data}) => {
    const [startDate, setStartDate] = useState(new Date());
    
    const fileName = "myfile";
    
    const filteredData = useMemo(() =>
        startDate ? data.filter(item => item.date === `${startDate.getFullYear()}-${getZero(startDate.getMonth()+ 1)}-${startDate.getDate()}`) : data, 
        // eslint-disable-next-line
    [startDate]);

    return (
        <>
            <div>
                <label style={{margin: "10px"}} htmlFor="name">Filter by Date:</label> <DatePicker className='datepicker' isClearable showIcon dateFormat="yyyy-MM-dd" selected={startDate} onChange={(date) => setStartDate(date)} />
                <ExportExcel excelData={filteredData} fileName={fileName} />
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
                            <td>{item.response}</td>
                            <td>{item.date}</td>
                            <td>{item.temperature}</td>
                            <td>{item.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p>There are no datas</p>}
        </>    
    )
}

export default Table;