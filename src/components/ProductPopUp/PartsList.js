import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";

const PartsList=(props)=>{


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

    const [category,setCategory]=useState(null)
    const [typeSelected,setTypeSelected]=useState(null)
    const [stateSelected,setStateSelected]=useState(null)
    const [types,setTypes]=useState([])
    const [states,setStates]=useState([])
    const [units,setUnits]=useState([])

    // const handleChange=(value,field )=>{
    //
    //     // let fields = this.state.fields;
    //     // fields[field] = value;
    //     //
    //     //
    //     //
    //     //
    //     // this.setState({ fields });
    //
    // }



    // useEffect(()=>{
    //
    //  console.log(types)
    // },[types])


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
                            // error={this.state.errors["category"]}
                            onChange={(value,valueText)=> {


                                setCategory(props.list.length>0? props.list.filter(
                                    (item) => item.category === value
                                )[0]:null)


                                let typeValues=props.list.length>0?props.list.filter(
                                    (item) => item.category === value
                                )[0]&&props.list.filter(
                                    (item) => item.category === value
                                )[0].types:[]
                                console.log(typeValues)
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
                            subOption={"name"}
                            valueKey={"_key"}
                            editMode
                            disableAutoLoadingIcon
                            // initialValue={this.props.item?this.props.item.product.state:""
                            //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.state:"")}
                            initialValue={props.item.fields?.unit}
                            onChange={(value,valueText) => {
                                // props.handleChange(value, valueText,`unit[${props.index}]`,props.uId,props.index);
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
                                 initialValue={props.item.fields?.composition}
                                details="Percentage Composition"
                                placeholder={""}
                                // readonly ={this.state.disableVolume}
                                // initialValue={this.props.item&&this.props.item.product.volume+""}
                                // value={this.state.disableVolume?"0":""}
                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)

                                    props.handleChange(value, valueText,`composition`,props.uId,props.index)

                                }

                                // error={this.state.errors["percentage"]}


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

export default PartsList