import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import SelectArrayWrapper from "../FormsUI/ProductForm/Select";
import TextFieldWrapper from "../FormsUI/ProductForm/TextField";

const ProcessesList=(props)=>{


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

                            <TextFieldWrapper
                                noMargin

                                editMode
                                initialValue={props.item.fields?.name}
                                details="Name"
                                placeholder={""}
                                // readonly ={this.state.disableVolume}
                                // initialValue={this.props.item&&this.props.item.product.volume+""}
                                // value={this.state.disableVolume?"0":""}
                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)

                                    props.handleChange(value, valueText,`name`,props.uId,props.index)

                                }

                                // error={this.state.errors["percentage"]}


                                name="name" title="Name"
                                // explanation={"Percentage value e.g 20"}
                            />

                     </div>
                        {/*<div className={"col-md-2 col-sm-12 col-xs-12"}>*/}
                        {/*    <TextFieldWrapper*/}
                        {/*        noMargin*/}
                        {/*        numberInput*/}
                        {/*        editMode*/}
                        {/*        initialValue={props.item.fields?.description}*/}
                        {/*        details="Description"*/}
                        {/*        placeholder={""}*/}
                        {/*        // readonly ={this.state.disableVolume}*/}
                        {/*        // initialValue={this.props.item&&this.props.item.product.volume+""}*/}
                        {/*        // value={this.state.disableVolume?"0":""}*/}
                        {/*        onChange={(value,valueText)=>*/}
                        {/*            // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)*/}

                        {/*            props.handleChange(value, valueText,`description`,props.uId,props.index)*/}

                        {/*        }*/}

                        {/*        // error={this.state.errors["percentage"]}*/}


                        {/*        name="description" title="Description"*/}

                        {/*    />*/}
                        {/*</div>*/}

                        <div className={"col-md-2 col-sm-12 col-xs-12"}>
                            <TextFieldWrapper
                                noMargin
                                numberInput
                                editMode
                                initialValue={props.item.fields?.kwh}
                                details=""
                                placeholder={""}
                                // readonly ={this.state.disableVolume}
                                // initialValue={this.props.item&&this.props.item.product.volume+""}
                                // value={this.state.disableVolume?"0":""}
                                onChange={(value,valueText)=>
                                    // props.handleChange(value, value,`unit[${props.index}]`,props.uId,props.index)
                                    props.handleChange(value, valueText,`kwh`,props.uId,props.index)
                                }
                                // error={this.state.errors["percentage"]}
                                name="kwh" title="Kwh"
                            />
                        </div>

                    <div className={"col-md-2 col-sm-12 col-xs-12"}>

                        <SelectArrayWrapper
                            option={"name"}
                            valueKey={"_id"}
                            editMode
                            disableAutoLoadingIcon
                            initialValue={props.item.fields?.energySource}
                            // initialValue={this.props.item?this.props.item.product.state:""
                            //     ||(this.state.selectedTemplate?this.state.selectedTemplate.value.product.state:"")}
                            onChange={(value,valueText)=> {

                                props.handleChange(value, valueText,`energySource`,props.uId,props.index);

                            }}
                            // error={this.state.errors["state"]}
                            select={"Select"}
                            disabled={ (props.list.length > 0 )? false : true}
                            options={props.list?props.list:[]} name={"energySource"}
                            title="Energy Source"

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

export default ProcessesList