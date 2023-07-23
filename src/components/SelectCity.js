import { useState} from 'react';
import Select from 'react-select';
import {kzcities} from '../db/kzcities';

const SelectCity = () => {

    
    const [selectedCity, setSelectedCity] = useState(null);
    
    const kzCitiesList = [];
    kzcities.map(item => kzCitiesList.push(Object.assign({}, {value: item.city, label: item.city})));
    console.log(kzCitiesList)

    return (
        <>
            <Select
                className='select'
                value={selectedCity}
                defaultValue={selectedCity}
                onChange={setSelectedCity}
                options={kzCitiesList}
            />
        </>
    )
}

export default SelectCity;