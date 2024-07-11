import axios from "axios";
import qs from 'qs';

export async function getPrediction(apiEndpoint,day,month,year) {
    try {

        console.log(apiEndpoint);
        const queryParams = qs.stringify({ day: day,month:month,year:year });

        const url = `${apiEndpoint}?${queryParams}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return { error: error.response };
    }
}
