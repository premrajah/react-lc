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

                <div id={props.item.index} key={props.item.index} className="row g-0 mt-2">

                <div className="col-11 ">
                    <div className={"row g-0"}>
                    <div className="col-md-4 col-sm-12">

                        <SelectArrayWrapper
                            editMode
                            details="Materials or category a product belongs to Type"
                            initialValue={props.item.fields?.transportMode}

                            select={"Select"}
                            // error={this.state.errors["category"]}
                            onChange={(value,valueText)=> {

                                props.handleChange(value, valueText,`transportMode`,props.uId,props.index);
                            }}
                            options={props.list}
                            name={"transportMode"}
                            title="Resource Category"
                        /></div>
                    <div className={"col-md-8 col-sm-12 col-xs-12"}>

                        <SearchPlaceAutocomplete
                            title={"Select Location"}
                            hideMap
                            // initialValue={this.props.edit&&this.props.item&&this.props.item}
                            onChange={(value,valueText) => {

                                console.log(value)
                                try {

                                    if ( value.latitude && value.longitude ) {

                                        props.handleChange({ latitude: value.latitude,
                                            longitude: value.longitude,}, valueText,`geo_location`,props.uId,props.index);

                                    }

                                }catch (e){
                                    console.log("map error")
                                            console.log(e)
                                }


                                props.handleChange({

                                }, valueText,`geo_location`,props.uId,props.index);

                            }
                            }

                        />
                </div>
                    </div>

                </div>
                <div
                    className="col-1 text-center"
                    style={{display: "flex"}}>
                    {/*{item > 1 && (*/}
                    <>
                        <DeleteIcon
                            classname={"click-item"}
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