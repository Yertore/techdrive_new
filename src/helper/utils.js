const utils = () => {
    const getZero = (num) => {
        if (num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    };
    
    const formatDate = (date) => {
        return `${date.getFullYear()}-${getZero(date.getMonth()+ 1)}-${getZero(date.getDate())}`
    }

    return {getZero, formatDate}

}

export default utils;