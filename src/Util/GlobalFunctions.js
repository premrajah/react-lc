import axios from "axios";
import {baseUrl} from "./Constants";

export const  capitalize=(sentence)=> {
    return sentence.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}



export const  seekAxiosGet= async (entity,count,offset,pageSize,no_parent, filters)=> {


        try {

            let url = `${baseUrl}seek?name=${entity}&count=${count}&offset=${offset}&size=${pageSize}`;

            if (no_parent){
                url=`${url}&no_parent=true`
            }

            if (filters.length>0){
                filters.forEach((filter)=>

                    url=url+"filters="+filter.key+":"+filter.value
                )

            }

            return   await axios.get(url);
            // console.log(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);

        }


}
