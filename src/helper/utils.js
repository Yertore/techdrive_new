const utils = () => {
    const getZero = (num) => {
        if (num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    };
    
    const formatDate = (date) => {
        return `${date?.$y}-${getZero(date?.$M + 1)}-${getZero(date?.$D)}`;
    }

    return {getZero, formatDate}

}

export default utils;