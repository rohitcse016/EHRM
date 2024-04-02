import moment from "moment";
import dayjs from 'dayjs';


export const convertDate = (inputDateString: any) => {
    // Parse the input date string using Moment.js
    const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
    // Format the parsed date in the desired format
    // const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate
}

export const convertDateInSSSZFormat = (inputDateString: any) => {
    // Parse the input date string using Moment.js
    const parsedDate = moment(inputDateString, 'YYYY-MM-DD HH:mm:ss');
    // Format the parsed date in the desired format
    const formattedDate = parsedDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    // const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate
}


export const convertTime = (inputDateString: any) => {
    if (!inputDateString) {
        return "00:00:00";
    }
    const dateTime = dayjs(inputDateString);
    return dateTime.format("HH:mm:ss")
}