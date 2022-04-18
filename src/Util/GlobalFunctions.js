import axios from "axios";
import {baseUrl} from "./Constants";
import React from "react";
import moment from "moment/moment";

export const  capitalize=(sentence)=> {
    return sentence.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}


const addAndFilters=(filters)=>{


    let url=""

    filters.forEach((row,index)=> {
            url = url + ""

            row.filters && row.filters.forEach((item, index) => {


                if (index > 0) {
                    url = url + row.operator
                }
                url = url + item.key + item.operator + item.value

            })


            // url = url + ")"
        }
    )

    return url


}


export const fetchErrorMessage=(e)=>{

    let errorString=""
    if (e.response.data.errors&&e.response.data.errors.length>0) {
        e.response.data.errors.forEach(item => {
            errorString =errorString+" "+ item.message

        })
    }else{

        errorString=e.response.status +" error received from server"

    }
    return errorString
}


export const arrangeAlphabatically=(items)=>{
  return   items.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })



}

export const arrangeObjectKeysAlphabatically=(obj)=>{


    return   Object.keys(obj).sort(function(a, b){

        if(a < b) { return -1; }
        if(a > b) { return 1; }


        return 0;
    })

}


export const sortArraysByKey=(array,key)=>{

    return   array.sort(function(a, b){
        if(a[key] < b[key]) { return -1; }
        if(a[key]> b[key]) { return 1; }
        return 0;
    })


}

export const createSeekURL=(entity,no_parent,count,offset, pageSize,filters, filterType, extra)=>{


    let url = `${baseUrl}seek?name=${entity}${extra?"&"+extra:""}`;


    url=url+`&count=${count}`



    if (offset===0||offset>0){

        url=url+`&offset=${offset}&size=${pageSize}`
    }
    if (no_parent){
        url=url+"&no_parent="+no_parent
    }

    if (filters&&filters.length>0&&filterType==="AND"){
        url=url+"&or="+addAndFilters(filters)
    }


    return url
}



export const  ifOwner=  (userDetail,orgId)=> {


    return   userDetail.orgId===orgId

}


export const  ownerCheck=  (userDetail,orgId)=> {


    return   userDetail.orgId===orgId

}

export const  seekAxiosGet=  (url)=> {


    return   axios.get((url)).catch((error)=>{

        console.error(error);


        return  fetchErrorMessage(error)

    });

}

export const  getTimeFormat=  (time)=> {


    return   moment(time).format("DD MMM YYYY")

}


export const   isEmptyHtml=( el )=>{
    // return trim(el.html())
}


export const getActionName=(actionName)=>{



    if (actionName==="withdrawn"){

        return "Withdraw"
    }
  else  if (actionName==="cancelled"){

        return "Cancel"
    }
    else  if (actionName==="rejected"){

        return "Rejected"
    }
    else  if (actionName==="accepted"){

        return "Accept"
    }
    else  if (actionName==="declined"){

        return "Decline"
    }
    else  if (actionName==="counter"){

        return "Counter Offer"
    }
    else  if (actionName==="confirmed"){

        return "Confirm"
    }
    else  if (actionName==="completed"){

        return "complete"
    }
    else  if (actionName==="progress"){

        return "Progress"
    }


    else{

        return  actionName
    }

}



