import axios from "axios";
import {baseUrl} from "./Constants";
import React from "react";

export const  capitalize=(sentence)=> {
    return sentence.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}


const addAndFilters=(filters)=>{


    let url=""

    filters.forEach((row,index)=> {

            console.log(row)
            url = url + "("

            console.log("****row********")
            console.log(row)
            console.log("****row********")
            row.filters && row.filters.forEach((item, index) => {


                if (index > 0) {
                    url = url + row.operator
                }
                url = url + item.key + item.operator + item.value

            })


            url = url + ")"
        }
    )

return url


}


export const fetchErrorMessage=(e)=>{

    let errorString=""

    // console.log('>> ',e.response.data.errors[0].message)
    if (e.response.data.errors&&e.response.data.errors.length>0) {
    e.response.data.errors.forEach(item => {
        errorString =errorString+" "+ item.message

})
    }else{

errorString=e.response.status +" error received from server"

    }
    return errorString
}



export const createSeekURL=(entity,no_parent,count,offset, pageSize,filters, filterType)=>{


    let url = `${baseUrl}seek?name=${entity}`;


        url=url+`&count=${count}`

    if (offset===0||offset>0){

        url=url+`&offset=${offset}&size=${pageSize}`
    }
    if (no_parent){
        url=url+"&no_parent="+no_parent
    }

    if (filters&&filters.length>0&&filterType==="AND"){
        url=url+"&any="+addAndFilters(filters)
    }


    return url
}


const CancelToken = axios.CancelToken;
let cancel;

export const  seekAxiosGet= async (url)=> {


    if (cancel !== undefined) {
        cancel();
    }

    return   axios.get(encodeURI(url),{ cancelToken: new CancelToken(function executor(c) {
                // An executor function receives a cancel function as a parameter
                cancel = c;
            })}
            ).catch((error)=>{
                if (axios.isCancel(error)) {
                    console.log("previous request cancelled");
                    return null
                }else {
                    console.error(error);


                    return  fetchErrorMessage(error)
                }
            });
            // console.log(resp.data);

    cancel()


}
