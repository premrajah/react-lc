import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";

const OutboundTransportList=(props)=>{


    const [list,setList]=useState([])
    useEffect(()=>{
       setList(props.list)
    },[props.list])

    return props.existingItems.map((item, index) => {

        return (
            <>
<DynamicAutoCompleteBox
    {...props}
    errors={props.errors[item.index]}
    item={item}
    uId={item.index}
    index={index}
    list={list}

/>
            </>)


    } )
}


const DynamicAutoCompleteBox=(props)=> {



    return (
        <>

                <div id={props.item.index} key={props.item.index} className="carbon-list row g-0 mt-2">

                <div className="col-11 ">
                    <div className={"row g-0"}>
                    <div className="col-md-4 col-sm-12">
                        <SelectArrayWrapper
                            editMode
                            error={props.errors?.transport_mode}
                            details="Materials or category a product belongs to Type"
                            initialValue={props.item.fields?.transport_mode}

                            select={"Select"}
                            // error={this.state.errors["category"]}
                            onChange={(value,valueText)=> {

                                props.handleChange(value, valueText,`transport_mode`,props.uId,props.index);
                            }}
                            options={props.list}
                            name={"transport_mode"}
                            title="Transport Mode"
                        /></div>
                    <div className={"col-md-8 col-sm-12 col-xs-12"}>

                        <SearchPlaceAutocomplete
                            error={props.errors?.geo_location}
                            fromOutboundTransport
                            title={`Site ${props.index+1}`}
                            hideMap
                            initialValue={props.item.fields?.geo_location}
                            onChange={(value,valueText) => {
                                
                                try {

                                    if (value&&value.latitude && value.longitude ) {

                                        props.handleChange({ latitude: value.latitude,
                                            longitude: value.longitude,address:value.address}, valueText,`geo_location`,props.uId,props.index);

                                    }

                                }catch (e){
                                    console.log("map error")
                                            console.log(e)
                                }
                            }
                            }

                        />
                        <span className="text-gray-light text-12 m-0 ellipsis-end">(Min 4 char required to search)</span>
                        {props.errors?.geo_location && <span  className="text-danger"> Required</span>}
                </div>
                    </div>

                </div>
                <div
                    className="col-1 text-center"
                    style={{display: "flex"}}>
                    {/*{item > 1 && (*/}
                    <>
                        <DeleteIcon
                            className={"click-item"}
                            style={{
                                color: "#ccc",
                                margin: "auto",
                            }}

                            onClick={()=>{
                                // setVisible(false);
                                props.deleteItem(props.item)
                            }}
                            // onClick={() => }
                        />
                    </>
                    {/*)}*/}
                </div>
            </div>

        </>
    )
}

export default OutboundTransportList