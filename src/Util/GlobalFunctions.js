import axios from "axios";
import {baseUrl} from "./Constants";

export const  capitalize=(sentence)=> {
    return sentence.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

}



export const  seekEntityGet=(entity,count,offset,pageSize,no_parent, filters)=> {


let url = `${baseUrl}seek/entity?name=${entity}&count=${count}
         &no_parent=true&offset=${offset}&size=${pageSize}`;
    axios
        .get(url)
        .then(
            (response) => {
                if(response.status === 200) {

                    this.setState({
                        items:this.state.items.concat(response.data.data),
                        loadingResults:false,
                        // lastPageReached:(response.data.data.length===0?true:false),
                        // currentOffset:newOffset+this.state.productPageSize

                    })
                }

            },
            (error) => {
            }
        )
        .catch(error => {}).finally(()=>{

    });

    // return

}
