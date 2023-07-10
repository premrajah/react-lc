import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";
import axios from "axios";
import {baseUrl} from "../../Util/Constants";
import SearchPlaceAutocomplete from "../FormsUI/ProductForm/SearchPlaceAutocomplete";
import CustomPopover from "../FormsUI/CustomPopover";
import {Info} from "@mui/icons-material";

const PartsList=(props)=>{


    const [list,setList]=useState([])
    const [transportModesList,setTransportModesList]=useState([])

    const [error,setError]=useState(false)

    useEffect(()=>{
       setList(props.list)
    },[props.list])

    useEffect(()=>{
        setTransportModesList(props.transportModesList)
    },[props.transportModesList])

    useEffect(()=>{
        setError(props.totalPercentError)
    },[props.totalPercentError])

    return (
        <>
            {props.existingItems.map((item, index) =>
            <React.Fragment key={item.index+"-box"}>
<DynamicAutoCompleteBox
    {...props}
    item={item}
    uId={item.index}
    errors={props.errors[item.index]}
    index={index}
    list={list}
    transportModesList={transportModesList}


/>


            </React.Fragment>)}
              {list.length>0 && error?<span className="border-red-error d-flex justify-content-end ">Total not equal to 100</span>:""}
    </>

    )



}


const DynamicAutoCompleteBox=(props)=> {

    const [category,setCategory]=useState(null)
    const [typeSelected,setTypeSelected]=useState(null)
    const [stateSelected,setStateSelected]=useState(null)
    const [types,setTypes]=useState([])
    const [showInbound,setShowInbound]=useState(false)
    const [states,setStates]=useState([])
    const [units,setUnits]=useState([])
    const [fields,setFields]=useState({})
    // const [errors,setErrors]=useState([])
    //
    // useEffect(()=>{
    //     console.log("setting errors",errors)
    //     setErrors(props.errors)
    //
    // },[props.errors])


    useEffect(()=>{


        if (props.item.fields?.category){
            let typeValues=props.list.length>0?props.list.filter(
                (item) => props.item.fields.category === item.category
            )[0]&&props.list.filter(
                (item) => props.item.fields.category === item.category
            )[0].types:[]
            setTypes(typeValues)


            if(props.item.fields?.type&&typeValues.length>0){

                let stateValues=typeValues.filter(
                    (item) => props.item.fields.type === item.type
                )[0].states
                setStates(stateValues)

                if(props.item.fields?.state&&stateValues.length>0){

                    let unitValues=stateValues.filter(
                        (item) => props.item.fields.state === item.state
                    )[0].units
                    setUnits(unitValues)
                }
            }
        }


    },[props.item.list])


    return (
        <>

                <div id={props.item.index} key={props.item.index} className="row g-0 mt-2">

                <div className="col-11 ">
                    <div className={"row g-0"}>
                    <div className="col-md-3 col-sm-12">

                        <SelectArrayWrapper
                            editMode
                            details="Materials or category a product belongs to Type"
                            initialValue={props.item.fields?.category}
                            option={"category"}
                            valueKey={"category"}
                            select={"Select"}
                            error={props.errors?.category}
                            onChange={(value,valueText)=> {
                                setCategory(props.list.length>0? props.list.filter(
                                    (item) => item.category === value
                                )[0]:null)
                                let typeValues=props.list.length>0?props.list.filter(
                                    (item) => item.category === value
                                )[0]&&props.list.filter(
                                    (item) => item.category === value
                                )[0].types:[]
                                setTypes(typeValues)
                                props.handleChange(value, valueText,`category`,props.uId,props.index);
                            }}
                            options={props.list} name={"category"}
                            title="Resource Category"
                        /></div>
                    <div className={"col-md-3 col-sm-12 col-xs-12"}>

                        <SelectArrayWrapper
                            editMode
                            initialValue={props.item.fields?.type}
                            disableAutoLoadingIcon
                            option={"type"}
                            valueKey={"type"}
                            select={"Select"}
                            // error={this.state.errors["type"]}
                            error={props.errors?.type}
                            onChange={(value,valueText)=> {
                                setStates([])
                                setUnits([])
                                setTimeout(()=>{
                                    if ( types&&types.length>0){
                                        let subCatSelected=types.find(
                                            (item) => item.type === value
                                        )
                                        let states=[]
                                        let units=[]
                                        if(subCatSelected) {
                                            states = subCatSelected.states
                                            units = subCatSelected.units
                                        }

                                        setUnits(units)
                                        setStates(states)
                                        setTypeSelected(subCatSelected ? subCatSelected : null)

                                    }
                                },500)

                                props.handleChange(value, valueText,`type`,props.uId,props.index);

                            }}

                            disabled={
                                ((types&&types.length > 0)) ? false : true
                            }
                            options={types?types:[]}
                            name={"type"}
                            title="Type"/>

                    </div>

                    <div className={"col-md-2 col-sm-12 col-xs-12"}>

                        <SelectArrayWrapper
                            option={"state"}
                            valueKey={"state"}
                            editMode
                            error={props.errors?.state}
                            disableAutoLoadingIcon
                            initialValue={props.item.fields?.state}
                            // initialValue={this.props.item?this.props.item.product.state:""
                            //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.state:"")}
                            onChange={(value,valueText)=> {
                                setUnits([])
                                setTimeout(()=>{
                                    if ( states&&states.length>0){
                                        let subCatSelected=states.find(
                                            (item) => item.state === value
                                        )
                                        let units=[]
                                        if(subCatSelected) {
                                            units = subCatSelected.units
                                        }
                                        setUnits(units)
                                        setStateSelected(subCatSelected ? subCatSelected : null)
                                    }
                                },500)
                                props.handleChange(value, valueText,`state`,props.uId,props.index);

                            }}
                            // error={this.state.errors["state"]}
                            select={"Select"}
                            disabled={ (states.length > 0 )? false : true}
                            options={states?states:[]} name={"state"} title="State"

                        />
                    </div>
                    <div className={"col-md-2 col-sm-12 col-xs-12"}>

                        <SelectArrayWrapper
                            option={"unit"}
                            valueKey={"first_id"}
                            editMode
                            error={props.errors?.unit}
                            disableAutoLoadingIcon
                            // initialValue={this.props.item?this.props.item.product.state:""
                            //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.state:"")}
                            initialValue={props.item.fields?.unit}
                            onChange={(value,valueText) => {
                                props.handleChange(value, valueText,`unit`,props.uId,props.index);
                            }}
                            // error={this.state.errors["state"]}
                            select={"Select"}
                            disabled={ (units&&units.length > 0 )? false : true}
                            options={units?units:[]} name={"unit"} title="Unit"

                        />
                    </div>

                        <div className={"col-md-2 col-sm-12 col-xs-12"}>
                             <TextFieldWrapper
                                 noMargin
                                numberInput
                                editMode
                                 error={props.errors?.percentage}
                                 initialValue={props.item.fields?.percentage}
                                details="Percentage"
                                placeholder={""}
                                // readonly ={this.state.disableVolume}
                                // initialValue={this.props.item&&this.props.item.product.volume+""}
                                // value={this.state.disableVolume?"0":""}
                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)

                                    props.handleChange(value, valueText,`percentage`,props.uId,props.index)

                                }


                                name="percentage" title="Percentage"
                                explanation={"Percentage value e.g 20"}
                             />


                        </div>

                    {/*<div className={"col-md-4 col-sm-12 col-xs-12"}>*/}
                        </div>


                </div>


                      <div
                    className="col-1 text-center"
                    style={{display: "flex"}}>
                    {/*{item > 1 && (*/}
                    <>
                        <DeleteIcon
                            className="click-item"
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


                    <div className="row  mt-2">
                        <div className="col-12 text-left">
                                        <span style={{ float: "left" }}>
                                            <span
                                                onClick={()=>setShowInbound(!showInbound)}
                                                className={
                                                    " forgot-password-link"
                                                }>

                                                      {showInbound
                                                          ? "Hide Add Inbound Transport"
                                                          : "Add Inbound Transport"} <CustomPopover text="Add parts details of a product"><Info style={{ cursor: "pointer", color: "#d7d7d7" }} fontSize={"24px"}/></CustomPopover>
                                            </span>
                                        </span>

                        </div>
                    </div>
                    {showInbound &&<div className={"row g-0"}>
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
                                options={props.transportModesList}
                                name={"transport_mode"}
                                title="Transport Mode"
                            /></div>
                        <div className={"col-md-8 col-sm-12 col-xs-12"}>

                            <SearchPlaceAutocomplete
                                error={props.errors?.geo_location}
                                fromOutboundTransport
                                title={"Material Origin Location"}
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
                            {props.errors?.geo_location && <span  className="text-danger"> Required</span>}
                        </div>
                    </div>}

            </div>

        </>
    )
}

export default PartsList