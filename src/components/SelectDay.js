import { useState} from 'react';
import Select from 'react-select';

const SelectDay = () => {

    
    const [selectedDay, setSelectedDay] = useState(null);
    
    const daysList = [
        {value: 1, label: "1 day"},
        {value: 3, label: "3 days"},
        {value: 7, label: "7 days"},
        {value: 14, label: "14 days"},
        {value: 16, label: "16 days"},
    ];

    return (
        <>
            <Select
                className='select'
                value={selectedDay}
                defaultValue={selectedDay}
                onChange={setSelectedDay}
                options={daysList}
            />
        </>
    )
}

export default SelectDay;